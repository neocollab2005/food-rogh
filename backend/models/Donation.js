const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  photo: {
    type: String
  },
  deliveryOption: {
    type: String,
    enum: ['user_will_donate', 'volunteer_will_collect'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'accepted', 'completed'],
    default: 'available'
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  destinationType: {
    type: String,
    enum: ['old_age_home', 'orphanage', 'temple']
  },
  destinationDetails: {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);