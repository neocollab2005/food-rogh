require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');


const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static('.'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login-user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login-user.html'));
});

app.get('/login-volunteer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login-volunteer.html'));
});

app.get('/register-user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register-user.html'));
});

app.get('/register-volunteer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register-volunteer.html'));
});

app.get('/forgot-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'forgot-password.html'));
});

app.get('/user-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'user-dashboard.html'));
});

app.get('/volunteer-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'volunteer-dashboard.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)