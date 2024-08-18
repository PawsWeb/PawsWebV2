const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// sqlite3 Database Connection
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database/database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Serve React App
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve Register Page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});


// Serve About Us Page
app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'aboutus.html'));
});

// Serve Our Pets Page
app.get('/ourpets', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ourpets.html'));
});

// Serve Educational Page
app.get('/educational', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'educational.html'));
});

// Serve faq Page
app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'faq.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});