var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var incidenciaSchema = new Schema({
    name: { type: String },
    dni: { type: String },
    tipo: { type: String},
    urgencia: { type: String},
    descripcion: { type: String}
 });
 module.exports = mongoose.model("Incidencia", incidenciaSchema);