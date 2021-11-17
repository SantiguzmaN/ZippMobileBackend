'use strict'

// modelos
var BalanceCode = require('../models/balance-code');
const readline = require("readline");
var fs = require("fs");

function getBalanceCode(req, res){
	
    var code = req.params.code;
	BalanceCode.findOne({"code":code}, (err, codigo) =>{
	  
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!codigo){
				res.status(404).send({
                    message: 'el codigo no existe'
                    
                });
      
			}else{
                res.status(200).send({codigo});
				
			}
		}
	});
}

function updateBalance(req, res){
	let balanceId = req.params.id;
	let update = req.body;
	BalanceCode.findByIdAndUpdate(balanceId, update,  {new:true}, (err, balanceUpdated) => {
		if(err){
			res.status(500).send({message:'Error al actualizar el codigo'});
		}else{
			if(!balanceUpdated){
				res.status(404).send({message:'No se ha podido actualizar el codigo'});
			}else{
				res.status(200).send({reserva_zipp: balanceUpdated});
				
			}
		}
	});
}

function uploadFile(req, res){
	var cc= req.files;
    let NOMBRE_ARCHIVO = cc.file_balance.path;
	let lector = readline.createInterface({
    	input: fs.createReadStream(NOMBRE_ARCHIVO)
	});
	lector.on("line", linea => {
			BalanceCode.findOne({"code":linea}, (errorr, codigo) =>{	  
				if(errorr){
				}else{
					if(!codigo){
						var balance = new BalanceCode();
						balance.code=linea;
						balance.value=2000;
						balance.used=true;
						balance.save((err, creado) => {
							if(err){
							}else{
								if (!creado) {
								}else{
								}
							}
						});
					}else{
					}
				}
			});
		});
	
}
module.exports = {
	getBalanceCode,
	updateBalance,
	uploadFile
};
