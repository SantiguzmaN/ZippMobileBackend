'use strict'

var express = require('express');
var BalanceCodeController = require('../controllers/balance-code');
var md_auth = require('../middlewares/authenticated');

var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/zonaszipp' });

var api = express.Router();
api.get('/getbalance/:code', BalanceCodeController.getBalanceCode);
api.put('/updatebalance/:id',BalanceCodeController.updateBalance);
api.post('/upload-file/', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], BalanceCodeController.uploadFile);


module.exports = api;