'use strict'

// modulos
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');



 
// modelos
var ReservaZona = require('../models/reserva-zona');
var UserConductor = require('../models/userConductor');
var UserZipp = require('../models/user');
// acciones


// Metodo para guardar las reservas ZIPP
function saveReservaZipp(req, res){
	var reserva_zipp = new ReservaZona();
	var params = req.body;
	console.log(''+params.userzonazipp.email);
	var transporter = nodemailer.createTransport({
		service:'Gmail',
		auth: {
			user: 'zippoficial@gmail.com',
			pass: '4n1t4l4v4l4t1n4'
		},
		tls:{
			rejectUnauthorized:false
		}
	 });
	 var mailOptions = {
		from: 'info@zipp.com.co',
		to: ''+params.userzonazipp.email,
		subject: 'Tu Zona ZIPP ha sido Tomada',
		html:'<head>'+
		'<meta charset="utf-8">'+
		'<title>ZIPP INFORMACIÓN</title>'+
		'</head>'+
		'<body style="background-color: #529548">'+
	
		'<table style="max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;">'+
			'<tr>'+
			'<td style="background-color: #ecf0f1; text-align: left; padding: 0">'+
				'<a href="https://www.zipp.com.co/">'+
					'<img width="94%" style="display:block; margin: 1.5% 3%" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154016/banner-correo-zipp_ulj8wr.jpg">'+
				'</a>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td style="background-color: #ecf0f1">'+
				'<div style="color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif">'+
					'<p style="margin: 2px; font-size: 15px">'+
						'Hola:  '+params.userzonazipp.name+'. Tienes un conductor que ha pagado por usar tu zona registrada: ('+ params.zonazipp.address+')</p>'+
					'<p style="margin: 2px; font-size: 15px">'+
						'Su nombre es: '+params.user.name+' y debe estar próximo a llegar en su vehiculo: '+ params.placa+'</p>'+
					'<h1 style="color: #b9ce0e; margin: 0 0 7px">¡FELICIDADES!</h1>'+
					'<div style="width: 100%;margin:20px 0; display: inline-block;text-align: center">'+
						'<img style="padding: 0; width: 200px; margin: 5px" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154031/logos_gowldu.png">'+
						'<img style="padding: 0; width: 150px; margin: 5px" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154038/play-sotre_x23y4l.png">'+
					'</div>'+
					'<div style="width: 100%; text-align: center">'+
						'<a style="text-decoration: none; border-radius: 5px; padding: 11px 23px; color: white; background-color:#b9ce0e" href="https://www.zipp.com.co/">Ir a la web ZIPP</a>'+	
					'</div>'+
					'<p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">Zonas Inteligentes de Permitido Parqueo 2019</p>'+
				'</div>'+
			'</td>'+
		'</tr>'+
	'</table>'+
	'</body>',
	 };	
	if(params.placa){
		reserva_zipp.placa = params.placa;
		reserva_zipp.valor_total = params.valor_total;
		reserva_zipp.fecha_inicio = params.fecha_inicio;
		reserva_zipp.fecha_final = params.fecha_final; 
		reserva_zipp.hora_inicio = params.hora_inicio;
		reserva_zipp.hora_fin = params.hora_fin;
		reserva_zipp.tiempo_total = params.tiempo_total;
		reserva_zipp.estado_reserva = params.estado_reserva;
		reserva_zipp.zonazipp = params.zonazipp;
		reserva_zipp.userzonazipp = params.userzonazipp;
		reserva_zipp.user = params.user;

		reserva_zipp.save((err, reserva_zippStored) => {
			if(err){
				res.status(500).send({message: 'Error en el servidor'});
			}else{
				if (!reserva_zippStored) {
					res.status(404).send({message: 'No se ha tomado la zona zipp'});
				}else{
					res.status(200).send({reserva_zipp: reserva_zippStored});
					transporter.sendMail(mailOptions, function(error, info){
						if (error){
							console.log(error);
							//res.send(500, err);
							return;
						} else {
							console.log("Email sent");
							//res.status(200).jsonp(req.body);
							transporter.close();
						}
					});
				}
			}
		});
	}else{
		res.status(200).send({
			message: 'La placa es obligatoria'
		});
	}
}

// Metodo para obtener las reservas ZIPP
function getReservasZipp(req, res){
	//var user_id = req.user.sub;
	ReservaZona.find({}).populate({path: 'user'}).populate({path: 'zonazipp'}).populate({path: 'userzonazipp'}).exec((err, reservas_zipp) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!reservas_zipp){
				res.status(404).send({
					message: 'No hay reservas zonas zipp'
				});
			}else{
				res.status(200).send({reservas_zipp});
			}
		}
	});
}

// Metodo para obtener las reservas ZIPP por usuario // historial
function getReservasZippByUser(req, res){
	var user_id = req.params.id;
	ReservaZona.find({"user":  user_id}).populate({path: 'user'}).populate({path: 'zonazipp'}).exec((err, reservas_zipp) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!reservas_zipp){
				res.status(404).send({
					message: 'No hay reservas zipp'
				});
			}else{
				res.status(200).send({reservas_zipp});
			}
		}
	});
}

//metodo para enviar emails, tanto al provedor como a el usuario al finalizar un servicio
function sendEmails(data){
	var userzipp = new UserZipp();
	var usercond = new UserConductor();
	let reserva = data;
	var user=reserva.user;
	var userzo=reserva.userzonazipp;
	UserConductor.findOne({"_id":user}, (err, user) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				console.log('user no existe');
			}else{
				usercond=user;
				UserZipp.findOne({"_id":userzo}, (err, user) =>{
					if(err){
						res.status(500).send({message: 'Error en la petición'});
					}else{
						if(!user){
							console.log('user no existe');
						}else{
							userzipp=user;
							var transporter = nodemailer.createTransport({
								service:'Gmail',
								auth: {
									user: 'zippoficial@gmail.com',
									pass: '4n1t4l4v4l4t1n4'
								}
							 });
							var mailOption = {
								from:'info@zipp.com.co',
								to:''+userzipp.email,
								subject: 'La reserva de tu Zona ZIPP ha finalizado',
								html:'<head>'+
								'<meta charset="utf-8">'+
								'<title>ZIPP INFORMACIÓN</title>'+
								'</head>'+
								'<body style="background-color: #529548">'+
							
								'<table style="max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;">'+
									'<tr>'+
									'<td style="background-color: #ecf0f1; text-align: left; padding: 0">'+
										'<a href="https://www.zipp.com.co/">'+
											'<img width="94%" style="display:block; margin: 1.5% 3%" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571193012/banner-correo-zipp_gxsaob.png">'+
										'</a>'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td style="background-color: #ecf0f1">'+
										'<div style="color: #34495e; margin: 4% 10% 2%;font-family: sans-serif">'+
											'<p style="margin: 2px; font-size: 15px">'+
											userzipp.name+'. El servicio en tu zona ZIPP ha finalizado. Nuevamente esta disponible para que alguien mas pueda usarla!</p>'+
												'<h1 style="color: #b9ce0e; margin: 0 0 7px">¡HASTA LA PROXIMA!</h1>'+
											'<div style="width: 100%;margin:20px 0; display: inline-block;text-align: center">'+
												'<img style="padding: 0; width: 200px; margin: 5px" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154031/logos_gowldu.png">'+
												'<img style="padding: 0; width: 150px; margin: 5px" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154038/play-sotre_x23y4l.png">'+
											'</div>'+
											'<div style="width: 100%; text-align: center">'+
												'<a style="text-decoration: none; border-radius: 5px; padding: 11px 23px; color: white; background-color:#b9ce0e" href="https://www.zipp.com.co/">Ir a la web ZIPP</a>'+	
											'</div>'+
											'<p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">Zonas Inteligentes de Permitido Parqueo 2019</p>'+
										'</div>'+
									'</td>'+
								'</tr>'+
							'</table>'+
							'</body>',
							};
													
							var mailOptions2 = {
								from: 'info@zipp.com.co',
								to: ''+usercond.email,
								subject: 'Acabas de finalizar el servicio en una Zona ZIPP',
								html:'<head>'+
								'<meta charset="utf-8">'+
								'<title>ZIPP INFORMACIÓN</title>'+
								'</head>'+
								'<body style="background-color: #529548">'+
							
								'<table style="max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;">'+
									'<tr>'+
									'<td style="background-color: #ecf0f1; text-align: left; padding: 0">'+
										'<a href="https://www.zipp.com.co/">'+
											'<img width="94%" style="display:block; margin: 1.5% 3%" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571193026/banner-correo-zipp2_gxpano.png">'+
										'</a>'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td style="background-color: #ecf0f1">'+
										'<div style="color: #34495e; margin: 4% 10% 2%;font-family: sans-serif">'+
											'<p style="margin: 2px; font-size: 15px">'+
												'Hola:  '+usercond.name+'. Acabas de finalizar tu servicio. Esperamos que este haya sido de tu total agrado.  </p>'+
											'<h1 style="color: #b9ce0e; margin: 0 0 7px">GRACIAS POR PREFERIRNOS!</h1>'+
									
											'<div style="width: 100%;margin:20px 0; display: inline-block;text-align: center">'+
												'<img style="padding: 0; width: 200px; margin: 5px" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154031/logos_gowldu.png">'+
												'<img style="padding: 0; width: 150px; margin: 5px" src="https://res.cloudinary.com/douxyvndb/image/upload/v1571154038/play-sotre_x23y4l.png">'+
											'</div>'+
											'<div style="width: 100%; text-align: center">'+
												'<a style="text-decoration: none; border-radius: 5px; padding: 11px 23px; color: white; background-color:#b9ce0e" href="https://www.zipp.com.co/">Ir a la web ZIPP</a>'+	
											'</div>'+
											'<p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">Zonas Inteligentes de Permitido Parqueo 2019</p>'+
										'</div>'+
									'</td>'+
								'</tr>'+
							'</table>'+
							'</body>',
								//text:'tomaron tu zona'
							};
							
							transporter.sendMail(mailOption, function(err, info){
								if (err){
									console.log(err);
										return;
								} else {
									console.log("Email1 sent");
									transporter.close();
								}
							});
							transporter.sendMail(mailOptions2, function(err, info){
								if (err){
									console.log(err);
									return;
								} else {
									console.log("Email2 sent");
									transporter.close();
								}
							});
						}
					}
				});
			}
		}
	});
}
// Metodo para actualizar una reserva ZIPP al finalizar
function updateReserva(req, res){
	let reservaId = req.params.id;
	let update = req.body;
	
	ReservaZona.findByIdAndUpdate(reservaId, update,  {new:true}, (err, reservaUpdated) => {
		if(err){
			res.status(500).send({message:'Error al actualizar la reserva'});
		}else{
			if(!reservaUpdated){
				res.status(404).send({message:'No se  ha podido actualizar la reserva'});
			}else{
				res.status(200).send({reserva_zipp: reservaUpdated});
				sendEmails(update);	
			}
		}
	});
}




// Exportar metodos
module.exports = {
	saveReservaZipp,
	getReservasZipp,
	getReservasZippByUser,
	updateReserva
};