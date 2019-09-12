var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

//Midelware
app.use(fileUpload());

app.put('/:collection/:id', (req, res, next) => {

    var collection = req.params.collection;
    var id = req.params.id;

    // Check collection allowed
    var allowedCollection = ['users', 'doctors', 'hospitals'];

    if (allowedCollection.indexOf(collection) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Collection not allow.',
            error: { message: 'Collections allow are ' + allowedCollection.join(', ') }
        });
    }

    // Check file
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No files selected.',
            error: { message: 'No files selected.' }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var file = req.files.image;
    var fileSplit = file.name.split('.');
    var fileExtension = fileSplit[fileSplit.length - 1];

    // Check file extension allowed
    var allowedExtension = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowedExtension.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'File extension not allow.',
            error: { message: 'File extension allow are ' + allowedExtension.join(', ') }
        });
    }

    // Create unique name
    var fileName = `${id}-${ new Date().getMilliseconds()}.${fileExtension}`;

    // Use the mv() method to place the file somewhere on your server
    var path = `./uploads/${collection}/${fileName}`;
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error uploading file.',
                error: { message: 'Error uploading file, ', err }
            });
        }

        uploadToCollection(collection, id, fileName, res);
    });
});

function uploadToCollection(collection, id, fileName, res) {
    if (collection === 'users') {
        User.findById(id, (err, userDB) => {
            // Check if exits
            if (!userDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'User does not exit.',
                    error: { message: 'User does not exit.' }
                });
            }

            var oldPath = './uploads/users/' + userDB.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {});
            }

            //Update userDB with new img name
            userDB.img = fileName;
            userDB.save((err, updateUserDB) => {
                return res.status(200).json({
                    ok: true,
                    message: 'File uploaded!',
                    user: updateUserDB
                });
            });
        });
    }

    if (collection === 'doctors') {
        Doctor.findById(id, (err, doctorDB) => {

            // Check if exits
            if (!doctorDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Doctor does not exit.',
                    error: { message: 'Doctor does not exit.' }
                });
            }

            var oldPath = './uploads/doctors/' + doctorDB.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {});
            }

            //Update userDB with new img name
            doctorDB.img = fileName;
            doctorDB.save((err, updateDoctorDB) => {
                return res.status(200).json({
                    ok: true,
                    message: 'File uploaded!',
                    doctor: updateDoctorDB
                });
            });
        });
    }

    if (collection === 'hospitals') {
        Hospital.findById(id, (err, hospitalDB) => {

            // Check if exits
            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital does not exit.',
                    error: { message: 'Hospital does not exit.' }
                });
            }

            var oldPath = './uploads/hospitals/' + hospitalDB.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {});
            }

            //Update userDB with new img name
            hospitalDB.img = fileName;
            hospitalDB.save((err, updateHospitalDB) => {
                return res.status(200).json({
                    ok: true,
                    message: 'File uploaded!',
                    hospital: updateHospitalDB
                });
            });
        });
    }
}

module.exports = app;