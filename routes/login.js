var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Import SEED
var SEED = require('../config/config').SEED;

// Initialize app
var app = express();

// Import User Schema
var User = require('../models/user');

// ==========================================
//              LOGIN USER
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, findUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error getting user.',
                errors: err
            });
        }

        // TODO: delete 'email' from message in production
        if (!findUser) {
            return res.status(400).json({
                ok: false,
                message: 'Incorrect credentials - email.',
                errors: err
            });
        }

        // TODO: delete 'password' from message in production
        if (!bcrypt.compareSync(body.password, findUser.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Incorrect credentials - password.',
                errors: err
            });
        }

        // Create token (expiresIn: time token is valid )
        findUser.password = ':)';
        var token = jwt.sign({ user: findUser }, SEED, { expiresIn: 14400 }); //4 hours

        res.status(200).json({
            ok: true,
            message: 'Login correct.',
            user: findUser,
            token: token,
            id: findUser.id
        });
    });

});

module.exports = app;