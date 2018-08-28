'use strict'

var express = require('express');
var messageController = require('../controllers/message');
var api = express.Router();
var middleAuth = require('../middlewares/authenticated');

api.get('/test-message', middleAuth.ensureAuth, messageController.test);

module.exports = api;