'user strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var jwtService = require('../services/jwt');

exports.ensureAuth = function(request, response, next) {
    if (!request.headers.authorization) {
        return response.status(403).send({
            message: 'La petición no tiene la cabecera de autenticación'
        });
    }

    var token = request.headers.authorization.replace(/["']+/g, '');
    try {
        var payload = jwt.decode(token, jwtService.secret);
        if (payload.exp <= moment.unix()) {
            return response.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        return response.status(404).send({
            message: 'El token no es válido'
        });
    }

    request.user = payload;
    next();

}