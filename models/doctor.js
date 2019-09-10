var mongoose = require('mongoose');

// Intitalize Schema
var Schema = mongoose.Schema;

// Define Doctor Schema
var doctorSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});

module.exports = mongoose.model('Doctor', doctorSchema);