'use strict'

var express = require('express');
var UserController = require('../controllers/userConductor');

var api = express.Router();
var md_auth = require('../middlewares/authenticated_conductor');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/pruebas-del-controlador-conductor', md_auth.ensureAuth, UserController.pruebas);

api.post('/register_conductor', UserController.saveUser);
api.get('/get-user-conductor/:id', UserController.getUserCo);
api.post('/get-user-pass', UserController.getUcC);
api.get('/get-users', UserController.getUsers);
api.post('/login_conductor', UserController.login);
api.put('/update-user-conductor/:id', UserController.updateUser);
api.put('/update-pass/:id', UserController.updatePass);


//api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-file-conductor/:imageFile', UserController.getImageFile);

module.exports = api;