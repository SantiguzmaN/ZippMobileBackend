'use strict'

exports.isConductor = function(req, res, next){
	if (req.userConductor.role != 'ROLE_CONDUCTOR') {
		return res.status(200).send({
			message: 'No tienes acceso a esta zona'
		});
	}

	next();
};