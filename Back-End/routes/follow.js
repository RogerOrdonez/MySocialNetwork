'use strict'

var express = require('express');
var followController = require('../controllers/follow');
var api = express.Router();
var middleAuth = require('../middlewares/authenticated');

api.get('/test-follow', middleAuth.ensureAuth, followController.test);

api.post('/follow', middleAuth.ensureAuth, followController.saveFollow);

api.delete('/follow/:id', middleAuth.ensureAuth, followController.deleteFollow);

module.exports = api;