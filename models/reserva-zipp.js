'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservaZonaSchema2 = Schema({
	placa: String,
	valor_total: Number,
	fecha_inicio: String,
	fecha_final: String,
	tiempo_total: String,
	estado_reserva: Boolean,
	zonazipp: { type: Schema.ObjectId, ref:'ZonaZipp'},
	userzonazipp: { type: Schema.ObjectId, ref:'User'},
	user: { type: Schema.ObjectId, ref:'UserConductor'}
});

module.exports = mongoose.model('ReservaZipp', ReservaZonaSchema2);