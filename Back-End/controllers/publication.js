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

module.exports = {
    test
}