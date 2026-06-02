const jwt       = require('jsonwebtoken');
const env       = require('../../config/env');
const database  = require('../../db/database');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization header is required.',
        });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Invalid authorization format.'
        });
    }

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        const user = database.findUserById(payload.userId);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid token user.'
            });
        }

        req.user = {
            id:     user.id,
            name:   user.name,
            role:   user.role,
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }
}

module.exports = authMiddleware;