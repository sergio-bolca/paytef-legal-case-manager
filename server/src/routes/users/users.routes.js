const express = require('express');

const authMiddleware    = require('../auth/auth.middleware');
const usersService      = require('./users.service');
const ROLES             = require('../../constants/roles');

const router = express.Router();

router.get('/assistants', authMiddleware, (req, res) => {
    if (req.user.role !== ROLES.LAWYER) {
        return res.status(403).json({
            message: 'Only lawyers can list assistants.'
        });
    }

    const assistants = usersService.listAssistants();
    return res.status(200).json({
        data: assistants
    });
});

module.exports = router;
