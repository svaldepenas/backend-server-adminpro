var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Intitalize Schema
var Schema = mongoose.Schema;

// Define User Roles
var validateRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido.'
};

// Define User Schema
var userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio.'] },
    surname: { type: String, required: [true, 'El apellido es obligatorio.'] },
    email: { type: String, unique: true, required: [true, 'El email es obligatorio.'] },
    // username: { type: String, unique: true, required: [true, 'El usuario es obligatorio.'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria.'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', required: true, enum: validateRoles },
    google: { type: Boolean, default: false }
});

// Add Mongoose Unique Validator for pretty message
userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' })

module.exports = mongoose.model('User', userSchema);