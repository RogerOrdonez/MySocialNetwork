'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var pagination = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var Follow = require('../models/follow');

function test(req, res) {
    res.status(200).send({
        mensaje: 'Ruta de pruebas de servidor NodeJS'
    });
}

function saveUser(request, response) {
    var params = request.body;
    var user = new User();

    if (params.name && params.surname && params.nick &&
        params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick.toLowerCase();
        user.email = params.email.toLowerCase();
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, usr) => {
            if (err) return response.status(500).send({ message: 'Error al consultar en la BD. ' + err });

            if (usr) return response.status(500).send({ message: 'Error al guardar, el usuario o nick ya existen en la BD. ' });
            else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err) return response.status(500).send({ message: 'Error al guardar el usuario. ' + err });

                        if (userStored) {
                            response.status(200).send({ user: userStored });
                        } else {
                            response.status(404).send({ message: 'No se ha registrado al usuario' });
                        }
                    });
                });
            }
        });

    } else {
        response.status(200).send({
            message: 'Faltan datos necesarios',
            parametros: {
                name: params.name,
                surname: params.surname,
                nick: params.nick,
                email: params.email,
                password: params.password
            }
        });
    }

}

function loginUser(request, response) {
    var params = request.body;
    var email = params.email;
    var password = params.password;

    /*User.findOne({ email: email }, 'name surname nick image role email password', (err, usr) => {
        console.log(usr);
        if (err) return response.status(500).send({ message: 'Error al consultar en la BD' + err });
        if (usr) {
            bcrypt.compare(password, usr.password, (err, check) => {
                if (err) return response.status(500).send({ message: 'Error al autenticar al usuario 1' + err });
                if (check) {
                    //Devolver datos de usuario
                    response.status(500).send({ user: usr });
                } else {
                    return response.status(500).send({ message: 'Error al autenticar al usuario 2' });
                }
            });
        } else {
            response.status(500).send({ message: 'Error al autenticar al usuario 3' });
        }
    });*/

    User.findOne({ email: email })
        .exec((err, usr) => {
            console.log(usr);
            if (err) return response.status(500).send({ message: 'Error al consultar en la BD' + err });
            if (usr) {
                bcrypt.compare(password, usr.password, (err, check) => {
                    if (err) return response.status(500).send({ message: 'Error al autenticar al usuario 1' + err });
                    if (check) {
                        if (params.gettoken) {
                            return response.status(200).send({
                                token: jwt.createToken(usr)
                            });
                        } else {
                            //Devolver datos de usuario
                            usr.password = undefined;
                            response.status(500).send({ user: usr });
                        }
                    } else {
                        return response.status(500).send({ message: 'Error al autenticar al usuario 2' });
                    }
                });
            } else {
                response.status(500).send({ message: 'Error al autenticar al usuario 3' });
            }
        });
}

function getUser(request, response) {
    var userId = request.params.id;
    User.findById(userId, (err, usr) => {
        if (err) {
            return response.status(500).send({ message: 'Error en la petición ' });
        }

        if (!usr) {
            return response.status(404).send({ message: 'Error: el usuario no existe' });
        }

        followThisUser(request.user.sub, userId)
            .then((value) => {
                usr.password = undefined;
                return response.status(200).send({ usr, following: value.following, followers: value.followers });
            })
            .catch((err) => {
                return response.status(500).send({ message: 'Error en la petición: ' + err });
            });

    });
}

async function followThisUser(identityUserId, userId) {
    try {
        var following = await Follow.findOne({ user: identityUserId, followed: userId }).exec()
            .then((following) => {
                return following;
            })
            .catch((err) => {
                return handleerror(err);
            });
        var followers = await Follow.findOne({ user: userId, followed: identityUserId }).exec()
            .then((followers) => {
                return followers;
            })
            .catch((err) => {
                return handleerror(err);
            });
        return {
            following,
            followers
        }
    } catch (e) {
        console.log(e);
    }
}

function getUsers(request, response) {
    var identityUser = request.user.sub;
    var page = 1;

    if (request.params.page) {
        page = request.params.page;
    }

    var itemsPerPage = 3;


    User.find().sort('_id').paginate(page, itemsPerPage, (err, usrs, total) => {

        if (err) {
            return response.status(500).send({ message: 'Error en la petición...' });
        }
        if (!usrs) {
            return response.status(404).send({ message: 'Error: No existen usuarios disponibles' });
        }
        if (page > Math.ceil(total / itemsPerPage)) {
            return response.status(404).send({ message: 'Error: Ya no hay más datos que consultar' });
        }

        return response.status(200).send({
            usrs,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function updateUser(request, response) {
    var userId = request.params.id;
    var update = request.body;

    if (update.password) {
        delete update.password;
    }
    if (userId != request.user.sub) {
        return response.status(500).send({ message: 'Error: Permisos insuficientes para actualizar los datos del usuario' });
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, usrUpdated) => {
        if (err) {
            return response.status(500).send({ message: 'Error en la petición...' });
        }
        if (!usrUpdated) {
            return response.status(404).send({ message: 'No se ha podido actualizar el usuario...' });
        }
        return response.status(200).send({
            user: usrUpdated
        });
    });
}

function uploadImage(request, response) {
    var userId = request.params.id;
    if (request.files) {
        var filePath = request.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[fileSplit.length - 1];
        var extFile = fileName.split('.');
        extFile = extFile[extFile.length - 1].toLowerCase();

        if (userId != request.user.sub) {
            return removeFileFromUploads(reponse, filePath, 'Error: Permisos insuficientes para actualizar los datos del usuario');
        }

        if (extFile == 'png' || extFile == 'jpg' || extFile == 'jpeg' || extFile == 'gif') {
            User.findByIdAndUpdate(userId, { image: fileName }, { new: true }, (err, userUpdated) => {
                if (err) {
                    return response.status(500).send({ message: 'Error en la petición...' });
                }
                if (!userUpdated) {
                    return response.status(404).send({ message: 'No se ha podido actualizar el usuario...' });
                }
                return response.status(200).send({
                    user: userUpdated
                });
            });
        } else {
            return removeFileFromUploads(reponse, filePath, 'Error: Extensión de archivo no válida.');
        }

    } else {
        return response.status(404).send({ message: 'Error: No se ha subido ningún archivo' });
    }
}

function getImageFile(request, response) {
    var imageFile = request.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            response.sendFile(path.resolve(pathFile));
        } else {
            response.status(404).send({ message: 'Error: No existe la imagen' });
        }
    });
}

function removeFileFromUploads(response, filePath, message) {
    fs.unlink(filePath, (err) => {
        response.status(500).send({ message: message });
    });
}

module.exports = {
    test,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}