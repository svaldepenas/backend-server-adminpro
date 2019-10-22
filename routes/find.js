var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// ==========================================
//           FIND ALL COLLECTIONS
// ==========================================

app.get('/all/:param', (req, res, next) => {

    var findParam = req.params.param;
    var regex = new RegExp(findParam, 'i');

    Promise.all([
            findHospitals(findParam, regex),
            findDoctors(findParam, regex),
            findUsers(findParam, regex)
        ])
        .then(response => {
            res.status(200).json({
                ok: true,
                hospitals: response[0],
                doctors: response[1],
                users: response[2]
            });
        });

});

// ==========================================
//           FIND BY COLLECTION
// ==========================================
app.get('/collection/:table/:param', (req, res, next) => {
    var table = req.params.table;
    var findParam = req.params.param;
    var regex = new RegExp(findParam, 'i');
    var promise;

    switch (table) {
        case 'hospital':
            promise = findHospitals(findParam, regex);
            break;
        case 'doctor':
            promise = findDoctors(findParam, regex);
            break;
        case 'user':
            promise = findUsers(findParam, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda son: user, hospital, doctor',
                error: { message: 'Tipo de tabla/colección inválido' }
            });
            break;
    }

    promise.then(response => {
        res.status(200).json({
            ok: true,
            [table]: response
        });
    });

});

// ==========================================
//          METHODS FIND COLLECTION
// ==========================================

function findHospitals(findParam, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitalCollection) => {
                if (err) {
                    reject('Error al buscar hospitales ', err);
                } else {
                    resolve(hospitalCollection);
                }
            });
    });
}

function findDoctors(findParam, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, doctorCollection) => {
                if (err) {
                    reject('Error al buscar doctores ', err);
                } else {
                    resolve(doctorCollection);
                }
            });
    });
}

function findUsers(findParam, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name surname email img role google')
            .or([{ name: regex }, { email: regex }])
            .exec((err, userCollection) => {
                if (err) {
                    reject('Error al buscar usuarios ', err);
                } else {
                    resolve(userCollection);
                }
            });
    });
}

module.exports = app;