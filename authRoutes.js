const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, logout } = require('./authController');

// Registration routes
router.post('/register-user', (req, res) => {
  req.body.role = 'user';
  registerUser(req, res);
});

router.post('/register-volunteer', (req, res) => {
  req.body.role = 'volunteer';
  registerUser(req, res);
});

// Login routes
router.post('/login-user', (req, res) => {
  req.body.role = 'user';
  loginUser(req, res);
});

router.post('/login-volunteer', (req, res) => {
  req.body.role = 'volunteer';
  loginUser(req, res);
});

// Password reset
router.post('/forgot-password', forgotPassword);

// Logout
router.post('/logout', logout);

module.exports = router;