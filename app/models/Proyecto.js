var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var proyectoSchema = new Schema({
    empresario: { type: String},
    name: { type: String ,unique: true},
    descripcion: { type: String},
    puestos: {type :Object},
    fotografos: { type: Number },
    diseniadores: { type: Number },
    programadores: { type: Number },
    publicistas: { type: Number },
    estado: { type: String}
 });
 module.exports = mongoose.model("Proyecto", proyectoSchema);