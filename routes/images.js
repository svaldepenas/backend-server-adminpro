var express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();

app.get('/:collection/:img', (req, res, next) => {

    var collection = req.params.collection;
    var img = req.params.img;

    var pathImg = path.resolve(__dirname, `../uploads/${collection}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImg);
    }

});

module.exports = app;