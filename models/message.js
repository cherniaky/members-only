var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    title: { type: String, required: true, maxlength: 30 },
    text: { type: String, required: true, maxlength: 500 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
});

//Export model
module.exports = mongoose.model("Message", MessageSchema);
