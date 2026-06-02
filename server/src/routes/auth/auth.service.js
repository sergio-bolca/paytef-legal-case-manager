const jwt       = require('jsonwebtoken');
const database  = require('../../db/database');
const env       = require('../../config/env');

function login({ name, password, remember = false }) {
    const user = database.findUserByName(name);

    if (!user || user.password !== password) {
        return null;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        env.jwtSecret,
        {
            expiresIn: remember ? '30d' : '8h'
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
        }
    };
}

module.exports = {
    login
};
