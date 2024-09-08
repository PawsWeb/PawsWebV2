const express = require('express');
const router = express.Router();
const db = require('../db');  // Import the db module directly

// Helper function to handle database errors
const handleDatabaseError = (err, res, customMessage) => {
    console.error(customMessage, err);
    return res.status(500).json({ error: customMessage });
};

// Login a user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the user exists
    const userCheckQuery = 'SELECT * FROM users WHERE username = ?';
    db.get(userCheckQuery, [username], (err, user) => {
        if (err) {
            return handleDatabaseError(err, res, 'An error occurred while checking the user.');
        }
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Successful login
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        // Redirect based on the user's role
        if (user.role === 'admin') {
            return res.redirect('/admin/manage-users'); // Redirect to the manage-user page for admins
        } else if (user.role === 'shelter') {
            req.session.shelter_id = user.id; // Store the shelter_id in the session
            return res.redirect('/shelter/pet-management');
        } else {
            return res.redirect('/'); // Redirect to the homepage for other users
        }
    });
});


// Register a new user
router.post('/register', (req, res) => {
    const { username, password, confirmPassword, name, email, role } = req.body;

    // Basic validation
    if (!username || !password || !confirmPassword || !name || !email || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if the username or email already exists
    const userCheckQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.get(userCheckQuery, [username, email], (err, existingUser) => {
        if (err) {
            return handleDatabaseError(err, res, 'An error occurred while checking if the user exists.');
        }
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Insert the new user into the database
        const insertUserQuery = `
            INSERT INTO users (username, password, name, email, role)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(insertUserQuery, [username, password, name, email, role], function(err) {
            if (err) {
                return handleDatabaseError(err, res, 'An error occurred while registering the user.');
            }

            // Automatically log the user in after registration
            req.session.user = {
                id: this.lastID,
                username,
                role
            };

            // Redirect based on the user's role
            if (role === 'shelter') {
                req.session.shelter_id = this.lastID; // Store the shelter_id in the session
                return res.redirect('/shelter/add-pet');
            } else {
                return res.redirect('/'); // Redirect to the homepage for other users
            }
        });
    });
});

// Logout a user
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return handleDatabaseError(err, res, 'Failed to log out');
        }
        res.redirect('/');
    });
});
// Route to handle scheduling a meeting request
router.post('/schedule-meeting', (req, res) => {
    const { animalId, name, email, contact } = req.body;

    // Basic validation
    if (!animalId || !name || !email || !contact) {
        return res.status(400).send('<script>alert("All fields are required!"); window.history.back();</script>');
    }

    // Insert the meeting request into the database
    const insertMeetingQuery = `
        INSERT INTO meeting_requests (animal_id, name, email, contact_number)
        VALUES (?, ?, ?, ?)
    `;
    db.run(insertMeetingQuery, [animalId, name, email, contact], function(err) {
        if (err) {
            console.error('Database error:', err.message); // Log the actual error
            return res.status(500).send('<script>alert("An error occurred while saving the meeting request. Please try again later."); window.history.back();</script>');
        }

        // Send a response that includes a script to show a popup and redirect
        res.send('<script>alert("Meeting request submitted successfully!"); window.location.href="/ourpets";</script>');
    });
});


module.exports = router;
