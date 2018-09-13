'use strict'

var express = require('express');
var publicationController = require('../controllers/publication');
var api = express.Router();
var middleAuth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var middleUpload = multiPart({ uploadDir: './uploads/publications' });

api.get('/test-publication', middleAuth.ensureAuth, publicationController.test);
api.get('/publications/:page?', middleAuth.ensureAuth, publicationController.getPublications);
api.get('/publications/:userId/:page', middleAuth.ensureAuth, publicationController.getPublications);
api.get('/publication/:id', middleAuth.ensureAuth, publicationController.getPublication);
api.get('/get-image-pub/:imageFile', middleAuth.ensureAuth, publicationController.getImageFile);


api.post('/publication', middleAuth.ensureAuth, publicationController.savePublication);
api.post('/upload-image-pub/:id', [middleAuth.ensureAuth, middleUpload], publicationController.uploadImage);

api.delete('/publication/:id', middleAuth.ensureAuth, publicationController.deletePublication);

module.exports = api;