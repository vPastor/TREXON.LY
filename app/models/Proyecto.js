var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var proyectoSchema = new Schema({
    proyecto_id: {type: Number,unique: true},
    nombre_empresa: { type: String},
    nombre_proyecto: { type: String },
    descripcion: { type: String},
    estado: { type: String}
 });
 module.exports = mongoose.model("Proyecto", proyectoSchema);