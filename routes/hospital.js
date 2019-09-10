var express = require('express');

// Import middleware verifyToken
var mdAuthentication = require('../middlewares/authentication');

// Initialize app
var app = express();

// Import Hospital Schema
var Hospital = require('../models/hospital');

// ==========================================
//              GET ALL HOSPITALS
// ==========================================
app.get('/', (req, res, next) => {
    Hospital.find({})
        .exec(
            (err, hospitalCollection) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting hospitals.',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospitals: hospitalCollection
                });
            }
        );
});

// ==========================================
//              UPDATE HOSPITAL
// ==========================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    Hospital.findById(id, (err, findHospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding hospital.',
                errors: err
            });
        }

        if (!findHospital) {
            return res.status(400).json({
                ok: false,
                message: 'Hospital whith id ' + id + ' does not exist.',
                errors: { message: 'Hospital whit this Id does not exist.' }
            });
        }

        var body = req.body;
        findHospital.name = body.name;
        findHospital.user = req.user._id;

        findHospital.save((err, hospitalSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating hospital.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });
        });

    });
});

// ==========================================
//              CREATE NEW HOSPITAL
// ==========================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;
    var userId = req.user._id;

    var hospital = new Hospital({
        name: body.name,
        user: userId
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating hospital.',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });
    });

});

// ==========================================
//              DELETE HOSPITAL
// ==========================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting hospital.',
                errors: err
            });
        }

        if (!hospitalDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Hospital whith id ' + id + ' does not exist.',
                errors: { message: 'Hospital whit this Id does not exist.' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted
        });
    })
})

module.exports = app;