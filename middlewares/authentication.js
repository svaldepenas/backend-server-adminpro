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

// ==========================================
//              VERIFY TOKEN
// ==========================================
exports.verifyAdmin = function(req, res, next) {
    var user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Token invalid.',
            errors: { message: 'No admin' }
        });
    }
}

// ==========================================
//              VERIFY TOKEN
// ==========================================
exports.verifyAdminOrOwn = function(req, res, next) {
    var user = req.user;
    var id = req.params.id;
    if (user.role === 'ADMIN_ROLE' || user._id === id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Token invalid.',
            errors: { message: 'No admin' }
        });
    }
}