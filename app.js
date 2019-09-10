// Requires
var express = require('express');
var mongoose = require('mongoose');


// Initialize variables
var app = express();

// DB Connection (the password is user database password)
const db = 'mongodb+srv://svaldepenas:valde1993@database-bfumq.mongodb.net/test?retryWrites=true&w=majority'
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('Database: \x1b[32m%s\x1b[0m', 'CONNECTED'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente.'
    });
});

// Listen
app.listen(3000, () => {
    console.log('Server on port 3000: \x1b[32m%s\x1b[0m', 'ONLINE');
});