var mongooose = require('mongoose');
var incidencias = require("../models/Incidencia");

// c) Controlador de asignaturas.js en la que aparezcan los métodos de listar, crear, 
// editar y eliminar así como la conexión al correspondiente modelo con Mongoose. (4p)
exports.create = async (req) => {

    var incidencia = new incidencias(req);
    var res = await incidencia.save((err, res) => {
        if (err) console.log(err);
        console.log("INSERTADO EN LA DB");
        console.log(res);
    });
    return res;
};

exports.list = async (req,res) => {
    
    var incidencia = await incidencias.find({});
    console.log(incidencia);
    return incidencia;

};
exports.edit = async (req) => {
    var res = await req.save((err, res) => {
        if (err) console.log(err);
        console.log("INSERTADO EN LA DB");
       
    });
    return res;

};

exports.delete = async (req) => {
    var res = await req.deleteOne((err, res) => {
        if (err) console.log(err);
        console.log("BORRADO DE LA DB");
        
    });
    return res;

};
