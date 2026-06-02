const express = require('express');

const authService = require('./auth.service');

const router = express.Router();

router.post('/login', (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({
            message: 'Name and password are required.',
        });
    }

    const result = authService.login({ name, password });

    if (!result) {
        return res.status(401).json({
            message: 'Invalid credentials.',
        });
    }

    return res.status(200).json(result);
});

module.exports = router;