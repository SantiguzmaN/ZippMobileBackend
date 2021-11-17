'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'zipp_componente_movil_user';

exports.createToken = function(userConductor){
	var payload = {
		sub: userConductor._id,
		cedula: userConductor.cedula,
		name: userConductor.name,
		email: userConductor.email,
		celular: userConductor.celular,
		role: userConductor.role,
		image: userConductor.image,
		ciudad: userConductor.ciudad,
		estado: userConductor.estado,
		saldo: userConductor.saldo,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);

}; 