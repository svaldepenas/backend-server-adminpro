var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Import SEED
var SEED = require('../config/config').SEED;

// Initialize app
var app = express();

// Import User Schema
var User = require('../models/user');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ==========================================
//          GOOGLE LOGIN USER
// ==========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(err => {
            res.status(200).json({
                ok: false,
                message: 'Token no valid.'
            });
        });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error getting user.',
                errors: err
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                res.status(400).json({
                    ok: false,
                    message: 'Cannot login by google, try normal authentication.'
                });
            } else {
                var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); //4 hours

                res.status(200).json({
                    ok: true,
                    message: 'Login correct.',
                    user: userDB,
                    token: token,
                    id: userDB.id,
                    menu: getMenu(userDB.role)
                });
            }
        } else {
            // User does not exist, must be created
            var user = new User();
            user.name = googleUser.name;
            user.surname = '...';
            user.email = googleUser.email;
            user.google = true;
            user.password = ':)';
            user.img = googleUser.img;

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error saving user to DB.',
                        errors: err
                    });
                }

                var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); //4 hours

                res.status(200).json({
                    ok: true,
                    message: 'Login correct.',
                    user: userDB,
                    token: token,
                    id: userDB.id,
                    menu: getMenu(userDB.role)
                });
            });
        }
    });

});

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
            id: findUser.id,
            menu: getMenu(findUser.role)
        });
    });

});

function getMenu(role) {
    var menu = [{
            title: 'Menu',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'Progress Bar', url: '/progress' },
                { title: 'Graphs', url: '/graph1' },
                { title: 'Promises', url: '/promises' },
                { title: 'RxJs', url: '/rxjs' }
            ]
        },
        {
            title: 'Mantenimiento',
            icon: 'mdi mdi-briefcase',
            submenu: [
                // { title: 'Users', url: '/users' },
                { title: 'Hospitals', url: '/hospitals' },
                { title: 'Doctors', url: '/doctors' }
            ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Users', url: '/users' });
    }

    return menu;
}


module.exports = app;