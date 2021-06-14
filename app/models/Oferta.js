var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ofertaSchema = new Schema({
    proyecto_id:{ type: String},
    nombre_proyecto: { type: String},
    nombre_empresa: { type: String},
    nombre_oferta:{ type: String},
    role: {type: String},
    experiencia: {type: String},
    sueldo: {type: String},
    descripcion: { type: String},
    estado: { type: String},
    aplicados: [Object]
 });
 module.exports = mongoose.model("Oferta", ofertaSchema);