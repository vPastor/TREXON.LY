const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// we create a user schema
let perfilSchema = new Schema({
nickname: {
    type: String,
    required: true,
    unique: true
  },
  foto: {
    type: String
  },
  experiencia: {
    type: String
  },
  formacion: {
    type: String,
  },
  intereses: {
    type: String,
  },
  portfolio: {
    type: [String]
  },
  createdAt: {
    type: Date,
    required: false
  },
  updatedAt: {
    type: Number,
    required: false
  },
}, { runSettersOnQuery: true }); // 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option.

perfilSchema.pre('save', function (next) {
  var currentDate = new Date().getTime();
  this.updatedAt = currentDate;
  if (!this.created_at) {
    this.createdAt = currentDate;
  }
  next();
})

var perfil = mongoose.model('perfil', perfilSchema);


module.exports = perfil;



