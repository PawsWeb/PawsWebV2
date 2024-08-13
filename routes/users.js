const express = require('express');
const router = express.Router();
const db = require('../index').db;

// Example Route: Get all users
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

module.exports = router;