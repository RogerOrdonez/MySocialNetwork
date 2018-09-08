'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function test(request, response) {
    response.status(200).send({ message: 'Ruta de pruebas de servidor NodeJS' });
}

function savePublication(request, response) {
    var params = request.body;

    if (!params.text) {
        response.status(500).send({ message: 'Debes enviar un texto en la publicación' });
    }

    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = request.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) {
            return response.status(500).send({ message: 'Error al guardar la publicación' });
        }
        if (!publicationStored) {
            return response.status(404).send({ message: 'La publicación no ha sido guardada' });
        }
        return response.status(200).send({ publication: publicationStored });
    });

}

function getPublications(request, response) {
    var userId = request.user.sub;
    var page = 1;
    if (request.params.page) {
        page = request.params.page;
    }
    var itemsPerPage = 10;
    Follow.find({ user: userId }).populate('followed', { '_id': 1 }).exec((err, follows) => {
        if (err) return response.status(500).send({ message: 'Error al buscar seguimientos' });
        var followsClean = [];

        follows.forEach((follow) => {
            followsClean.push(follow.followed);
        });

        followsClean.push(userId);

        Publication.find({ user: { $in: followsClean } })
            .sort('-created_at')
            .populate('user', { 'name': 1, 'surname': 1, 'nick': 1, 'image': 1 })
            .paginate(page, itemsPerPage, (err, publications, total) => {
                if (err) return response.status(500).send({ message: 'Error al buscar publicaciones' });
                if (!publications) return response.status(404).send({ message: 'No se encotró ninguna publicación.' });
                return response.status(200).send({
                    totalItems: total,
                    pages: Math.ceil(total / itemsPerPage),
                    page: page,
                    itemsPerPage: itemsPerPage,
                    publications
                });
            });

    });
}

function getPublication(request, response) {
    var publicationId = request.params.id;
    Publication.findById(publicationId, (err, publication) => {
        if (err) return response.status(500).send({ message: 'Error al buscar publicación' });
        if (!publication) return response.status(404).send({ message: 'No se encotró la publicación.' });
        return response.status(200).send({ publication });
    });
}

function deletePublication(request, response) {
    var publicationId = request.params.id;
    Publication.find({ user: request.user.sub, _id: publicationId }).remove((err) => {
        if (err) return response.status(500).send({ message: 'Error al eliminar publicación' });
        return response.status(200).send({ message: 'Publicación eliminada' });
    });
}

function uploadImage(request, response) {
    var publicationId = request.params.id;
    if (request.files) {
        var filePath = request.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[fileSplit.length - 1];
        var extFile = fileName.split('.');
        extFile = extFile[extFile.length - 1].toLowerCase();

        if (extFile == 'png' || extFile == 'jpg' || extFile == 'jpeg' || extFile == 'gif') {
            Publication
                .findOne({ user: request.user.sub, _id: publicationId })
                .update({ file: fileName }, (err) => {
                    if (err) {
                        return response.status(500).send({ message: 'Error en la petición...' });
                    }
                    return response.status(200).send({
                        message: 'Publicación actualizada'
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
    var pathFile = './uploads/publications/' + imageFile;
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
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}