const express = require('express');

const authMiddleware    = require('../auth/auth.middleware');
const casesService      = require('./cases.service');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    const cases = casesService.listCasesByUser(req.user);
    return res.status(200).json({
        data: cases
    });
});

router.post('/', authMiddleware, (req, res) => {
    const result = casesService.createCase(req.user, req.body);

    if (result.error) {
        return res.status(result.error.status).json({
            message: result.error.message
        });
    }

    return res.status(201).json({
        data: result.data
    });
});

router.patch('/:id', authMiddleware, (req, res) => {
    const caseId = Number(req.params.id);

    if (Number.isNaN(caseId)) {
        return res.status(400).json({
            message: 'Invalid case id.'
        });
    }

    const result = casesService.updateCase(req.user, caseId, req.body);

    if (result.error) {
        return res.status(result.error.status).json({
            message: result.error.message
        });
    }

    return res.status(200).json({
        data: result.data
    });
});

router.delete('/:id', authMiddleware, (req, res) => {
    const caseId = Number(req.params.id);

    if (Number.isNaN(caseId)) {
        return res.status(400).json({
            message: 'Invalid case id.'
        });
    }

    const result = casesService.deleteCase(req.user, caseId);

    if (result.error) {
        return res.status(result.error.status).json({
            message: result.error.message
        });
    }

    return res.status(200).json({
        data: result.data
    });
});

module.exports = router;