const express = require('express');
const router = express.Router();
const db = require('../db');  // Directly import the db module

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};

router.get('/manage-users', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login'); // Redirect to login if not an admin
    }
    
    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            return handleDatabaseError(err, res, 'An error occurred while fetching users.');
        }
        res.render('manage-user', { users: users, user: req.session.user }); // Pass both users and the logged-in user
    });
});


// Route to delete a user by ID (admin-only)
router.delete('/users/:id', checkAdmin, (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Failed to delete user.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ message: 'User deleted successfully.' });
    });
});

// Route to get all shelters (admin-only)
router.get('/shelters', checkAdmin, (req, res) => {
    db.all('SELECT * FROM shelters', (err, shelters) => {
        if (err) {
            console.error('Error fetching shelters:', err);
            return res.status(500).json({ error: 'Failed to retrieve shelters.' });
        }
        res.render('manage-shelters', { shelters });
    });
});

// Route to delete a shelter by ID (admin-only)
router.delete('/shelters/:id', checkAdmin, (req, res) => {
    const shelterId = req.params.id;
    db.run('DELETE FROM shelters WHERE id = ?', [shelterId], function(err) {
        if (err) {
            console.error('Error deleting shelter:', err);
            return res.status(500).json({ error: 'Failed to delete shelter.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Shelter not found.' });
        }
        res.json({ message: 'Shelter deleted successfully.' });
    });
});

module.exports = router;
