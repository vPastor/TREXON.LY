var mongooose = require('mongoose');
var chats = require("../models/Chat");

// c) Controlador de asignaturas.js en la que aparezcan los métodos de listar, crear, 
// editar y eliminar así como la conexión al correspondiente modelo con Mongoose. (4p)
exports.create = async (req) => {

    var chat = new chats(req);
    var res = await chat.save((err, res) => {
        if (err) console.log(err);
        console.log("INSERTADO EN LA DB");
        
    });
    return res;
};

exports.list = async () => {

    var chat = await chats.find({});
    return res.status(200).json(chat);

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
