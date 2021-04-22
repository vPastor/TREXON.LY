var mongooose = require('mongoose');
var Proyecto = require("../models/Proyecto");

// c) Controlador de asignaturas.js en la que aparezcan los métodos de listar, crear, 
// editar y eliminar así como la conexión al correspondiente modelo con Mongoose. (4p)
exports.create = async (req) => {

    var proyecto = new Proyecto(req);
    var res = await proyecto.save((err, res) => {
        if (err) console.log(err);
        console.log("INSERTADO EN LA DB");
        console.log(res);
    });
    return res;
};

exports.list = async (req,res) => {
    
    var proyecto = await Proyecto.find({});
    console.log(proyecto);
    return proyecto;

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
