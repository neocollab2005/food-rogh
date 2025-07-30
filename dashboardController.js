const { User, Donation } = require('./User');

const submitDonation = async (req, res) => {
  try {
    const { foodName, quantity, location, photoUrl, donationType, coordinates } = req.body;
    
    const donation = new Donation({
      userId: req.user._id,
      foodName,
      quantity,
      location,
      photoUrl,
      donationType,
      coordinates
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation submitted successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting donation',
      error: error.message
    });
  }
};

const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
      error: error.message
    });
  }
};

const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ 
      status: 'available',
      donationType: 'volunteer_collect'
    })
    .populate('userId', 'name address')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available donations',
      error: error.message
    });
  }
};

const acceptDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Donation is no longer available'
      });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.user._id;
    await donation.save();

    res.json({
      success: true,
      message: 'Donation accepted successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting donation',
      error: error.message
    });
  }
};

const completeDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { destinationType } = req.body;
    
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.status = 'completed';
    donation.destinationType = destinationType;
    await donation.save();

    res.json({
      success: true,
      message: 'Donation completed successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing donation',
      error: error.message
    });
  }
};

module.exports = {
  submitDonation,
  getUserDonations,
  getAvailableDonations,
  acceptDonation,
  completeDonation
};