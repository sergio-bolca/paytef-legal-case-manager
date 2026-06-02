const express = require('express');

const authMiddleware    = require('../auth/auth.middleware');
const usersService      = require('./users.service');

const router = express.Router();

router.get('/assistants', authMiddleware, (req, res) => {
    const assistants = usersService.listAssistants();
    return res.status(200).json({
        data: assistants
    });
});

module.exports = router;