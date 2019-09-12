var mongoose = require('mongoose');

// Intitalize Schema
var Schema = mongoose.Schema;

// Define Hospital Schema
var hospitalSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hospital', hospitalSchema);