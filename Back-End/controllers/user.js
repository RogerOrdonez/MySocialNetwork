'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

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

        return response.status(200).send(usr);

    });
}

module.exports = {
    test,
    saveUser,
    loginUser,
    getUser
}