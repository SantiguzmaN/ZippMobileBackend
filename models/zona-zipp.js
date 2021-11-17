'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZonaZippSchema = Schema({
	city: String,
	address: String,
	number_spaces: Number,
	price: Number,
	big_type: Boolean,
	medium_type: Boolean,
	small_type: Boolean,
	electric_station: Boolean,
	leave_key: Boolean,
	total_hours_day: Boolean,
	cctv: Boolean,
	phone: Boolean,
	roofed: Boolean,
	security_guard: Boolean,
	car_type: Boolean,
	motorcycle_type: Boolean,
	bike_type: Boolean,	
	image_zona_zipp: String,
	image_bill: String,
	estado_zonazipp: Boolean,
	horary: String,
	lat: Number,
	lng: Number,
	description: String,
	score: Number,
	fechaC: String,
	isParking: Boolean,
	user: { type: Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('ZonaZipp', ZonaZippSchema);