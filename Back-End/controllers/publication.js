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

module.exports = {
    test,
    savePublication
}