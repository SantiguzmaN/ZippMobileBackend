'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BalanceCodeSchema = Schema({
	code: String,
	value: Number,
	used: Boolean,
});

module.exports = mongoose.model('BalanceCode', BalanceCodeSchema, 'balancecode');