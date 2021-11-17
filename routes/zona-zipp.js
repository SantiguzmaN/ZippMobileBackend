'use strict'

var express = require('express');
var ZonaZippController = require('../controllers/zona-zipp');
//var ReservaZonaController = require('../controllers/reserva-zona');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/zonaszipp' });

var md_upload_bill = multipart({ uploadDir: './uploads/bills' });

// Obtener zonas y zona ZIPP .
api.get('/zonaszipp', ZonaZippController.getZonasZipp);
api.get('/zonaszipp2', ZonaZippController.getZonasZipp2);
api.get('/zonazipp/:id', ZonaZippController.getZonaZipp);
api.get('/zonazippbyuser/:id', ZonaZippController.getZonasZippByUser);

api.get('/recordszonazipp/:id', ZonaZippController.getRecordZonasZipp);


// Guardar zona ZIPP web
api.post('/zonazipp', [md_auth.ensureAuth, md_admin.isAdmin], ZonaZippController.saveZonaZipp2);

// Actualizar zona ZIPP
api.put('/zonazippact/:id', ZonaZippController.updateZonaZipp);
// Actualizar zona ZIPPweb
api.put('/zonazipp2/:id', md_auth.ensureAuth, ZonaZippController.updateZonaZipp);

// Actualizar y obtener imagenes de la zona ZIPP
api.post('/upload-image-zonazipp/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], ZonaZippController.uploadImageZonaZipp);
api.get('/get-image-zonazipp/:imageFile', ZonaZippController.getImageFile);

// Actualizar y obtener imagenes de la factura servicio publico de la zona ZIPP
api.post('/upload-image-zonazipp-bill/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload_bill], ZonaZippController.uploadImageZonaZippBill);
api.get('/get-image-zonazipp-bill/:imageFile', ZonaZippController.getImageFileBill);

// Borrar una zona ZIPP
api.delete('/zonazipp/:id', [md_auth.ensureAuth, md_admin.isAdmin], ZonaZippController.deleteZonaZipp);




module.exports = api;