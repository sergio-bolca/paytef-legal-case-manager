const express = require('express');

const authService = require('./auth.service');

const router = express.Router();

router.post('/login', (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({
            message: 'Request body must be an object.',
        });
    }

    const { name, password, remember } = req.body;

    if (!name || !password) {
        return res.status(400).json({
            message: 'Name and password are required.',
        });
    }

    const result = authService.login({ name, password, remember: Boolean(remember) });

    if (!result) {
        return res.status(401).json({
            message: 'Invalid credentials.',
        });
    }

    return res.status(200).json(result);
});

module.exports = router;
