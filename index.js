const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'pet_adoption'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
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