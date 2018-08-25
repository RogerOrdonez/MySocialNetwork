'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var middleAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/test', middleAuth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;