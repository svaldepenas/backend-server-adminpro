var express = require('express');

// Import middleware verifyToken
var mdAuthentication = require('../middlewares/authentication');

// Initialize app
var app = express();

// Import Doctor Schema
var Doctor = require('../models/doctor');

// ==========================================
//              GET ALL DOCTOR
// ==========================================
app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    Doctor.find({})
        .skip(since)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (err, doctorCollection) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting doctors.',
                        errors: err
                    });
                }

                Doctor.countDocuments({}, (err, count) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error getting doctors count.',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        countDoctors: count,
                        doctors: doctorCollection
                    });
                });
            }
        );
});

// ==========================================
//              GET DOCTOR
// ==========================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    Doctor.findById(id)
        .populate('user', 'name email img')
        .populate('hospital')
        .exec(
            (err, doctor) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting doctors.',
                        errors: err
                    });
                }

                Doctor.countDocuments({}, (err, count) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error getting doctors count.',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        countDoctors: count,
                        doctor: doctor
                    });
                });
            }
        );
});

// ==========================================
//              UPDATE DOCTOR
// ==========================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    Doctor.findById(id, (err, findDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding doctor.',
                errors: err
            });
        }

        if (!findDoctor) {
            return res.status(400).json({
                ok: false,
                message: 'Doctor whith id ' + id + ' does not exist.',
                errors: { message: 'Doctor whit this Id does not exist.' }
            });
        }

        var body = req.body;
        findDoctor.name = body.name;
        findDoctor.user = req.user._id;
        findDoctor.hospital = body.hospital;

        findDoctor.save((err, doctorSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating doctor.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                doctor: doctorSaved
            });
        });

    });
});

// ==========================================
//              CREATE NEW DOCTOR
// ==========================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((err, doctorSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating doctor.',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: doctorSaved
        });
    });

});

// ==========================================
//              DELETE DOCTOR
// ==========================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting doctor.',
                errors: err
            });
        }

        if (!doctorDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Doctor whith id ' + id + ' does not exist.',
                errors: { message: 'Doctor whit this Id does not exist.' }
            });
        }

        res.status(200).json({
            ok: true,
            doctor: doctorDeleted
        });
    })
})

module.exports = app;