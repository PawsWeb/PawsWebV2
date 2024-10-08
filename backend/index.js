const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const PetsModel = require("./models/Pets");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require("multer");
const path = require('path');
const UserModel = require("./models/User");
const Homepage = require("./models/Homepage");
const Faq = require("./models/Faq");
const Educational = require("./models/Educational");

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', async (req, res) => {
  try {
    const content = await Homepage.findOne({ published: true });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const otp = crypto.randomInt(100000, 999999);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    res.status(201).json({ message: 'User registered successfully. Check your email for OTP.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        res.json("Success");
      } else {
        res.status(401).json("Password does not match!");
      }
    } else {
      res.status(401).json("No Records Found!");
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Failed to log out');
    }
    res.clearCookie('connect.sid');
    res.status(200).send('Logged out');
  });
});

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});

app.get('/educationals', async (req, res) => {
  try {
    const educationals = await Educational.find();
    res.json(educationals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/educationals', async (req, res) => {
  const educational = new Educational(req.body);
  try {
    await educational.save();
    res.status(201).json(educational);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/educational/:id', async (req, res) => {
  try {
    const educational = await Educational.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(educational);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/educational/:id', async (req, res) => {
  try {
    await Educational.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// FAQ
app.get('/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/faqs', async (req, res) => {
  const faq = new Faq(req.body);
  try {
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/faq/:id', async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/faq/:id', async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message, subject } = req.body;

  try {
    const mailOptions = {
      from: email, 
      to: 'pawsweb.2024@gmail.com',
      replyTo: email, 
      subject: `Contact Form Submission: ${subject}`,

      text: `You have received a new message from the contact form on your website.\n\n `+
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Subject: ${subject}\n\n` +
            `Message:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

app.post("/admin/create-listing", upload.array('images', 10), async (req, res) => {
  const { name, breed, size, age, gender, shelter, description } = req.body;
  const images = req.files.map(file => file.filename); 
  
  try {
      const newPet = new PetsModel({
          name,
          breed,
          size,
          age,
          gender,
          shelter,
          description,
          images
      });

      await newPet.save();

      res.status(201).json({ message: "Pet listing added successfully!" });
  } catch (err) {
      console.error("Error adding pet listing:", err);
      res.status(500).json({ message: "Failed to add pet listing" });
  }
});

app.get('/getPets', async (req, res) => {
  try {
    const pets = await PetsModel.find(); // Fetch all pets from MongoDB
    res.status(200).json(pets); // Return the pets as JSON
  } catch (err) {
    console.error("Error retrieving pets:", err);
    res.status(500).json({ message: "Failed to retrieve pets" });
  }
});

app.get('/getPet/:id', async (req, res) => {
  try {
    const pet = await PetsModel.findById(req.params.id); // Use PetsModel here
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    console.error('Error fetching pet:', err);
    res.status(500).json({ message: 'Error fetching pet' });
  }
});

app.put('/admin/edit-listing/:id', async (req, res) => {
  try {
    const updatedPet = await PetsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Use PetsModel here
    if (!updatedPet) return res.status(404).json({ message: 'Pet not found' });
    res.json(updatedPet);
  } catch (err) {
    console.error('Error updating pet:', err);
    res.status(500).json({ message: 'Error updating pet' });
  }
});

app.delete('/admin/delete-listing/:id', async (req, res) => {
  try {
    const pet = await PetsModel.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error("Error deleting pet listing:", err);
    res.status(500).json({ message: 'Failed to delete pet listing' });
  }
});