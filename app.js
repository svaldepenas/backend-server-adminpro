// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Import routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var findRoutes = require('./routes/find');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');


// Initialize variables
var app = express();

//Confin BodyParser (Middleware)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Connection (the password is user database password)
const db = 'mongodb+srv://svaldepenas:valde1993@database-bfumq.mongodb.net/hospitalDB?retryWrites=true&w=majority'
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('Database: \x1b[32m%s\x1b[0m', 'CONNECTED'))
    .catch(err => console.log(err));

// Server index config: to show pictures on web
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Routes (Middleware)
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/find', findRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Listen
app.listen(3000, () => {
    console.log('Server on port 3000: \x1b[32m%s\x1b[0m', 'ONLINE');
});