var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    nick: { type: String },
    text: { type: String },
    msgs: { type: [Object] },
    created_at: { type: Date, default: Date.now }
 });
 module.exports = mongoose.model("Chat", chatSchema);