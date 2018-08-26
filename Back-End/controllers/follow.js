'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function test(request, response) {
    response.status(200).send({ message: 'Ruta de pruebas de servidor NodeJS' })
}

function saveFollow(request, response) {
    var params = request.body;
    var follow = new Follow();
    follow.user = request.user.sub;
    follow.followed = params.followed;
    follow.save((err, followStored) => {
        if (err) {
            return response.status(500).send({ message: 'Error: No se pudo guardar el follow.' });
        }
        if (!followStored) {
            return response.status(404).send({ message: 'Error: No se guardó el follow.' });
        }
        return response.status(200).send({ follow: followStored });
    });
}

module.exports = {
    test,
    saveFollow
}