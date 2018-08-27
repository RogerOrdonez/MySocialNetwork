'use strict'

var express = require('express');
var publicationController = require('../controllers/publication');
var api = express.Router();
var middleAuth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var middleUpload = multiPart({ uploadDir: './uploads/publications' });

api.get('/test-publication', middleAuth.ensureAuth, publicationController.test);
api.get('/publications/:page?', middleAuth.ensureAuth, publicationController.getPublications);

api.post('/publication', middleAuth.ensureAuth, publicationController.savePublication);

module.exports = api;