const express = require('express');
const path = require('path');
const session = require('express-session');  // Add this for session handling
const db = require('./db');  // Import the database connection
const app = express();

// Configure session middleware
app.use(session({
    secret: 'your-secret-key',  // Replace with a secure key
    resave: false,
    saveUninitialized: true
}));

// Import route handlers
const usersRouter = require('./routes/users');
const shelterRouter = require('./routes/shelter');
const adminRouter = require('./routes/admin');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up routes for rendering EJS templates
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register', (req, res) => {
    res.render('register'); 
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
});

app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'aboutus.html'));
});

app.get('/ourpets', (req, res) => {
    const search = req.query.search || '';
    const query = `
        SELECT * FROM animals
        WHERE name LIKE ? OR breed LIKE ? OR size LIKE ?
    `;
    const searchParam = `%${search}%`;

    db.all(query, [searchParam, searchParam, searchParam], (err, rows) => {
        if (err) {
            return res.status(500).send("An error occurred while fetching animals data.");
        }
        res.render('ourpets', { animals: rows, search }); // Pass search to template
    });
});


// Route to display educational content
app.get('/educational', (req, res) => {
    const query = 'SELECT title, content FROM posts';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send("An error occurred while fetching educational posts.");
        }
        res.render('educational', { posts: rows });
    });
});


app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'faq.html'));
});

app.get('/admin/manage-users', (req, res) => {
    // Fetch the list of users from the database
    const query = 'SELECT * FROM users';
    db.all(query, (err, users) => {
        if (err) {
            return res.status(500).send("An error occurred while fetching user data.");
        }
        // Render the manage-user.ejs template and pass the list of users
        res.render('manage-user', { users: users });
    });
});
app.get('/schedule-meeting', (req, res) => {
    const animalId = req.query.animalId;

    // Fetch the specific animal's data from the database
    const query = 'SELECT * FROM animals WHERE id = ?';
    db.get(query, [animalId], (err, animal) => {
        if (err || !animal) {
            return res.status(404).send('Animal not found');
        }
        res.render('schedule-meeting', { animal });
    });
});

app.get('/shelter/meeting-requests', (req, res) => {
    const shelterId = req.session.shelter_id;

    // Check if the shelter ID is in the session, which indicates the user is logged in as a shelter
    if (!shelterId) {
        return res.redirect('/login');  // Redirect to login if not authenticated as a shelter
    }

    // Query to fetch meeting requests associated with the shelter
    const query = `
        SELECT mr.id, mr.name, mr.email, mr.contact_number, mr.requested_date, a.name AS animal_name 
        FROM meeting_requests mr
        JOIN animals a ON mr.animal_id = a.id
        WHERE a.shelter_id = ?
        ORDER BY mr.requested_date DESC
    `;

    // Execute the query
    db.all(query, [shelterId], (err, rows) => {
        if (err) {
            console.error('An error occurred while fetching meeting requests:', err.message);
            return res.status(500).send('An error occurred while fetching meeting requests.');
        }

        // Render the meeting requests page with the data fetched
        res.render('view-meeting-requests', { requests: rows });
    });
});



// Use the users, shelter, and admin routers for handling respective routes
app.use('/users', usersRouter);
app.use('/shelter', shelterRouter);
app.use('/admin', adminRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
