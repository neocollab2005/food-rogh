const express = require('express');
const Donation = require('../models/Donation');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Submit Donation (User)
router.post('/submit-donation', authMiddleware, async (req, res) => {
  try {
    const { foodName, quantity, location, photo, deliveryOption } = req.body;
    
    const donation = new Donation({
      userId: req.user._id,
      foodName,
      quantity,
      location,
      photo,
      deliveryOption
    });

    await donation.save();
    res.status(201).json({ message: 'Donation submitted successfully', donation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Donations
router.get('/user-donations', authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Available Donations (Volunteer)
router.get('/available-donations', authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ 
      deliveryOption: 'volunteer_will_collect',
      status: 'available' 
    }).populate('userId', 'name address location').sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept Donation (Volunteer)
router.post('/accept-donation/:id', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation already accepted' });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.user._id;
    await donation.save();

    const populatedDonation = await Donation.findById(donation._id).populate('userId', 'name address location');
    res.json({ message: 'Donation accepted successfully', donation: populatedDonation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Accepted Donations (Volunteer)
router.get('/accepted-donations', authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ 
      acceptedBy: req.user._id,
      status: { $in: ['accepted', 'completed'] }
    }).populate('userId', 'name address location').sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete Donation
router.post('/complete-donation/:id', authMiddleware, async (req, res) => {
  try {
    const { destinationType, destinationDetails } = req.body;
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = 'completed';
    donation.destinationType = destinationType;
    donation.destinationDetails = destinationDetails;
    await donation.save();

    res.json({ message: 'Donation completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Live Users (for map display)
router.get('/live-users', async (req, res) => {
  try {
    const users = await User.find({ 
      location: { $exists: true, $ne: null } 
    }).select('name location role').limit(50);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;