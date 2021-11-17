 
// modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// modelos
var UserConductor = require('../models/userConductor');
var user = new UserConductor();
// servivio jwt
var jwt = require('../services/jwt-conductor');

// acciones
function pruebas(req, res){
	res.status(200).send({
		message: 'Prueba acción pruebas'
	});
}

function saveUser(req, res){
	// creación del objeto usuario
	var user = new UserConductor();

	// recoger parametros petición
	var params = req.body;

	if(params.password && params.cedula && params.name && params.email && params.celular){
		// asignación de valores al objeto usuario
		user.cedula = params.cedula;
		user.name = params.name;
		user.email = params.email;
		user.celular = params.celular;
		user.role = 'ROLE_CONDUCTOR';
		user.image = 'qixdXosVZZSmcxatfjJGa5Jn.png';
		user.ciudad = params.ciudad;
		user.estado = params.estado;
		user.saldo = '0';
		user.fechaC = params.fechaC;

		UserConductor.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
			if(err){
				res.status(500).send({message: 'Error al comprobar el usuario'});
			}else{
				if (!issetUser) {

					// cifrado de contraseña
					bcrypt.hash(params.password, null, null, function(err, hash){
						user.password = hash;

						// guardar usuario en bd
						user.save((err, userStored) => {
							if(err){
								res.status(500).send({message: 'Error al guardar el usuario'});
							}else{
								if(!userStored){
									res.status(404).send({message: 'No se ha registrado el usuario'});
								}else{
									res.status(200).send({user: userStored});
								}
							}
						});
					});


				}else{
					res.status(200).send({
						message:'El usuario ya existe'
					});
				}
			}
		});
	}else{
		res.status(200).send({
			message:'Introduce los datos correctamente para poder registrar al usuario'
		});
	}
}

function getUcC(req, res){
	var params = req.body;
	var userced = params.cedula;
	var usercel = params.celular;
	var useremail = params.email;
	console.log('entro con:'+userced)
	UserConductor.findOne({cedula:userced,celular:usercel, email:useremail}).exec((err, user) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!user){
				console.log('no encontro:');
				res.status(404).send({err});
			}else{
				console.log('encontro:'+user.name);
				res.status(200).send({user});
			}
		}
	});



}

function getUsers(req, res){
	UserConductor.find({}).exec((err, users) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!users){
				res.status(404).send({
					message: 'No hay usuarios'
				});
			}else{
				res.status(200).send({users});
			}
		}
	});
}

// Metodo para obtener usuario
function getUserCo(req, res){
	var useride = req.params.id;
		
	UserConductor.findOne({"_id":useride}, (err, user) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({
					message: 'el usuario no existe'
				});
			}else{
				res.status(200).send({user});
			}
		}
	});
}



function login(req, res){
	var params = req.body;
	var cedula = params.cedula;
	var password = params.password;

	UserConductor.findOne({cedula: cedula.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error al loguear el usuario'});
		}else{
			if (user) {
				bcrypt.compare(password, user.password, (err, check) => {
					if(check){
						if(params.gettoken){
							// devolver token jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({
							message:'El usuario no ha podido loguear correctamente!'
						});
					}
				});
			}else{
				res.status(404).send({
					message:'El usuario no ha podido loguearse'
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;
	delete update.password;

	/*
	if(userId != req.user.sub){
		return res.status(500).send({
			message:'No tienes permiso para actualizar el usuario'
		});
	}*/

	UserConductor.findByIdAndUpdate(userId, update,  {new:true}, (err, userUpdated) => {
		if(err){
			res.status(500).send({message:'Error al actualizar usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message:'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}
function updatePass(req, res){
	var userId = req.params.id;
	var update = req.body;
	bcrypt.hash(update.password, null, null, function(err, hash){
		update.password = hash;
		// guardar usuario en bd
		UserConductor.findByIdAndUpdate(userId, update,  {new:true}, (err, userUpdated) => {
			if(err){
				res.status(500).send({message:'Error al actualizar usuario'});
			}else{
				if(!userUpdated){
					res.status(404).send({message:'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({user: userUpdated});
				}
			}
		});
	});
}


function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'No subido ..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.')
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			if(userId != req.user.sub){
				return res.status(500).send({
					message:'No tienes permiso para actualizar el usuario'
				});
			}

			UserConductor.findByIdAndUpdate(userId, {image: file_name},  {new:true}, (err, userUpdate) => {
				if(err){
					res.status(500).send({
						message:'Error al actualizar usuario'
					});
				}else{
					if(!userUpdate){
						res.status(404).send({
							message:'No se ha podido actualizar el usuario'
						});
					}else{
						res.status(200).send({user: userUpdate, image: file_name});
					}
				}
			});


		}else{
			fs.unlink(file_path, (err) => {
				if(err){
					res.status(200).send({message: 'Extención no valida y fichero no borrado'});
				}else{
					res.status(200).send({message: 'Extención no valida'});
				}
			});
		}

	}else{
		res.status(200).send({
			message: 'No se han subido ficheros'
		});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({
				message: 'La imagen no existe'
			});
		}
	}); 
}



module.exports = {
	pruebas,
	saveUser,
	getUserCo,
	getUcC,
	getUsers,
	login,
	updateUser,
	updatePass,
	uploadImage,
	getImageFile
};