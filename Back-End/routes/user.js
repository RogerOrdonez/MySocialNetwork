'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var multiParty = require('connect-multiparty');
var middleAuth = require('../middlewares/authenticated');
var middleUpload = multiParty({ uploadDir: './uploads/users' });

var api = express.Router();

api.get('/test', middleAuth.ensureAuth, UserController.test);
api.get('/user/:id', middleAuth.ensureAuth, UserController.getUser);
api.get('/users/:page', middleAuth.ensureAuth, UserController.getUsers);
api.get('/get-image-file/:imageFile', middleAuth.ensureAuth, UserController.getImageFile);
api.put('/update-user/:id', middleAuth.ensureAuth, UserController.updateUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [middleAuth.ensureAuth, middleUpload], UserController.uploadImage);

module.exports = api;