'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var userRoutes = require('./routes/user');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rutas
app.use('/api', userRoutes);

// exportar
module.exports = app;