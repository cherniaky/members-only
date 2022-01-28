var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, maxlength: 30 },
    password: { type: String, required: true, maxlength: 500 },
    isMember: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
});

//Export model
module.exports = mongoose.model("User", UserSchema);
