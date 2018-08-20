"use strict"

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/MySocialNetwork', { useMongoClient: true })
    .then(() => {
        console.log('La conexión a la BD MySocialNetwork ha sido exitosa...');
    })
    .catch((error) => {
        console.log('Hubo un error al establecer la conexión con la BD MySocialNetwork: ' + error)
    });