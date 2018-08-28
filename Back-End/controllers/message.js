'use strict'

var moment = require('moment');
var mongooseaPaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function test(request, response) {
    response.status(200).send({ message: 'Ruta de pruebas de servidor NodeJS' });
}

function sendMessage(request, response) {
    var params = request.body;
    if (!params.text || !params.receiver) {
        response.status(500).send({ message: 'Faltan parámetros para enviar un mensaje' });
    }
    var message = new Message();
    message.emitter = request.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.save((err, messageSended) => {
        if (err) return response.status(500).send({ message: 'Error en la petición al mandar mensaje' });
        if (!messageSended) return response.status(404).send({ message: 'No se mandó ningún mensaje' });
        return response.status(200).send({ message: messageSended });
    });
}

module.exports = {
    test,
    sendMessage
}