var jwt = require('jsonwebtoken');

// Import SEED
var SEED = require('../config/config').SEED;

// ==========================================
//              VERIFY TOKEN
// ==========================================
exports.verifyToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token invalid.',
                errors: err
            });
        }

        // Add user token to request
        req.user = decoded.user;

        next();
    });
}