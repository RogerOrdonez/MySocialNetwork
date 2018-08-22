'use strict'

var User = require('../models/user');

function home(req, res) {
    res.status(200).send({
        mensaje: 'Ruta Home del servidor NodeJS'
    });
}

function pruebas(req, res) {
    res.status(200).send({
        mensaje: 'Ruta de pruebas de servidor NodeJS'
    });
}

module.exports = {
    home,
    pruebas
}