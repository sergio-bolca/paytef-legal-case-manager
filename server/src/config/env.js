const env = {
    port:       process.env.PORT || 3000,
    jwtSecret:  process.env.JWT_SECRET || 'development-secret',
    host:       process.env.UI_URL || 'http://localhost:5173',
};

module.exports = env;