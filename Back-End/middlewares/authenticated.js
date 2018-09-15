'user strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var jwtService = require('../services/jwt');

exports.ensureAuth = function(request, response, next) {
    var token;
    if (request.body && request.body.headers && request.body.headers.lazyUpdate) {
        for (var i = 0; i < request.body.headers.lazyUpdate.length; i++) {
            if (request.body.headers.lazyUpdate[i].name.toLowerCase() === 'authorization') {
                token = request.body.headers.lazyUpdate[i].value.replace(/["']+/g, '');
            }
        }
    }
    if (!request.headers.authorization && !token) {
        return response.status(403).send({
            message: 'La petición no tiene la cabecera de autenticación'
        });
    }

    if (!token) {
        token = request.headers.authorization.replace(/["']+/g, '');
    }

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