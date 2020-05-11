var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const newUserSchema = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, expires: 60*60*24*7, default: Date.now } // expires in 7 days
});

exports.model = mongoose.model('newUser', newUserSchema);

exports.schema = newUserSchema;