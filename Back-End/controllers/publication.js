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
    var itemsPerPage = 4;
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
                    publications
                });
            });

    });

}

module.exports = {
    test,
    savePublication,
    getPublications
}