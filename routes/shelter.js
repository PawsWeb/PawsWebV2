const express = require('express');
const router = express.Router();
const db = require('../db');  // Import the db module directly

// Route to render the add-pet page
router.get('/add-pet', (req, res) => {
    const shelter_id = req.session.shelter_id; // Ensure shelter_id is stored in session after login
    if (!shelter_id) {
        return res.status(400).json({ error: 'Shelter ID is missing' });
    }
    res.render('add-pet', { shelter_id }); // Pass shelter_id to the EJS template
});

// Route to handle the form submission for adding a new pet
router.post('/add-pet', (req, res) => {
    console.log('Received POST request to add-pet:', req.body);

    const { name, breed, size, age, gender, description, image_url, shelter_id } = req.body;

    // Basic validation
    if (!name || !breed || !size || !age || !gender || !shelter_id) {
        return res.status(400).json({ error: 'All fields except description and image_url are required' });
    }

    // Insert the new pet into the database
    const insertPetQuery = `
        INSERT INTO animals (name, breed, size, age, gender, description, image_url, shelter_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(insertPetQuery, [name, breed, size, age, gender, description, image_url, shelter_id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/shelter/pet-management');
    });
});
// Route to delete a pet
router.post('/delete-pet', (req, res) => {
    const petId = req.body.petId;

    if (!petId) {
        return res.status(400).json({ error: 'Pet ID is required' });
    }

    const deleteQuery = 'DELETE FROM animals WHERE id = ?';
    db.run(deleteQuery, [petId], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('An error occurred while deleting the pet.');
        }

        console.log(`Pet with ID ${petId} deleted successfully.`);
        res.redirect('/shelter/pet-management'); 
    });
});
// Route to display the pet management page
router.get('/pet-management', (req, res) => {
    const shelterId = req.session.shelter_id;

    if (!shelterId) {
        return res.redirect('/login');  // Redirect to login if not authenticated
    }

    const query = `
        SELECT * FROM animals WHERE shelter_id = ?
    `;

    db.all(query, [shelterId], (err, pets) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('An error occurred while fetching pets.');
        }
        
        res.render('pet-management', { pets: pets });  // Render the pet-management view
    });
});




// Route to view meeting requests
router.get('/meeting-requests', (req, res) => {
    const shelterId = req.session.shelter_id;

    if (!shelterId) {
        return res.redirect('/login');  // Redirect to login if not authenticated
    }

    const query = `
        SELECT mr.id, mr.name, mr.email, mr.contact_number, mr.requested_date, a.name AS animal_name 
        FROM meeting_requests mr
        JOIN animals a ON mr.animal_id = a.id
        WHERE a.shelter_id = ?
        ORDER BY mr.requested_date DESC
    `;

    db.all(query, [shelterId], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('An error occurred while fetching meeting requests.');
        }
        
        console.log('Meeting Requests:', rows); // Log the meeting requests here
        
        res.render('view-meeting-requests', { requests: rows });
    });
});


// Route to delete a meeting request
router.post('/delete-meeting-request', (req, res) => {
    const requestId = req.body.requestId;

    const deleteQuery = 'DELETE FROM meeting_requests WHERE id = ?';
    db.run(deleteQuery, [requestId], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('An error occurred while deleting the meeting request.');
        }

        res.redirect('/shelter/meeting-requests');
    });
});

module.exports = router;
