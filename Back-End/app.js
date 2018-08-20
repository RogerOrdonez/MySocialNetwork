'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rutas
app.get('/', (req, res) => {
    res.status(200).send({
        mensaje: 'Ruta Home del servidor NodeJS'
    });
});

app.get('/prueba', (req, res) => {
    res.status(200).send({
        mensaje: 'Ruta de pruebas de servidor NodeJS'
    });
});

// exportar
module.exports = app;