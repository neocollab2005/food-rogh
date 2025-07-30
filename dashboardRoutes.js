const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const { 
  submitDonation, 
  getUserDonations, 
  getAvailableDonations, 
  acceptDonation, 
  completeDonation 
} = require('./dashboardController');

// Apply auth middleware to all dashboard routes
router.use(authMiddleware);

// User dashboard routes
router.post('/submit-donation', submitDonation);
router.get('/user-donations', getUserDonations);

// Volunteer dashboard routes
router.get('/available-donations', getAvailableDonations);
router.post('/accept-donation/:donationId', acceptDonation);
router.post('/complete-donation/:donationId', completeDonation);

module.exports = router;