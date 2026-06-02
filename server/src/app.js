const express   = require('express');
const cors      = require('cors');

const env = require('./config/env');
const app = express();

const authRoutes    = require('./routes/auth/auth.routes');
const casesRoutes   = require('./routes/cases/cases.routes');
const usersRoutes   = require('./routes/users/users.routes');

app.use(cors({ origin: env.host }));

app.use(express.json());

app.use('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'paytef-legal-case-manager',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;