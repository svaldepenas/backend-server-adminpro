var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Import middleware verifyToken
var mdAuthentication = require('../middlewares/authentication');

// Initialize app
var app = express();

// Import User Schema
var User = require('../models/user');

// ==========================================
//              GET ALL USERS
// ==========================================
app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    User.find({}, 'name surname email img role google')
        .skip(since)
        .limit(5)
        .exec(
            (err, userCollection) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting users.',
                        errors: err
                    });
                }

                User.countDocuments({}, (err, count) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error getting users count.',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        countUsers: count,
                        users: userCollection
                    });
                });


            }
        );
});

// ==========================================
//              UPDATE USER
// ==========================================
app.put('/:id', [mdAuthentication.verifyToken, mdAuthentication.verifyAdminOrOwn], (req, res) => {
    var id = req.params.id;

    User.findById(id, (err, findUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user.',
                errors: err
            });
        }

        if (!findUser) {
            return res.status(400).json({
                ok: false,
                message: 'User whith id ' + id + ' does not exist.',
                errors: { message: 'User whit this Id does not exist.' }
            });
        }

        var body = req.body;
        findUser.name = body.name;
        findUser.surname = body.surname;
        findUser.email = body.email;
        // findUser.username = body.username;
        findUser.role = body.role;

        findUser.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating user.',
                    errors: err
                });
            }

            userSaved.password = ':)';

            res.status(200).json({
                ok: true,
                user: userSaved
            });
        });

    });
});

// ==========================================
//              CREATE NEW USER
// ==========================================
app.post('/', (req, res) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        surname: body.surname,
        email: body.email,
        // username: body.username,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating user.',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });
    });

});

// ==========================================
//              DELETE USER
// ==========================================
app.delete('/:id', [mdAuthentication.verifyToken, mdAuthentication.verifyAdmin], (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user.',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'User whith id ' + id + ' does not exist.',
                errors: { message: 'User whit this Id does not exist.' }
            });
        }

        userDeleted.password = ':)';

        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    })
})

module.exports = app;