'use strict'

var express = require('express');
var ReservaZonaController = require('../controllers/reserva-zona');

var api = express.Router();

// Guardar zona ZIPP
//api.post('/zonazipp', [md_auth.ensureAuth, md_admin.isAdmin], ZonaZippController.saveZonaZipp);

// Actualizar zona ZIPP
//api.put('/zonazipp/:id', md_auth.ensureAuth, ZonaZippController.updateZonaZipp);

// reservar zona zipp
api.post('/reservazonazipp', ReservaZonaController.saveReservaZipp);

api.get('/reservaszipp', ReservaZonaController.getReservasZipp);
api.get('/reservaszippbyuser/:id', ReservaZonaController.getReservasZippByUser);

api.put('/actualizareserva/:id', ReservaZonaController.updateReserva);


module.exports = api;