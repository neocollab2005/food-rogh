const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'volunteer'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  hintQuestion: {
    type: String,
    required: true
  },
  hintAnswer: {
    type: String,
    required: true
  },
  areaOfOperation: {
    type: String,
    required: function() {
      return this.role === 'volunteer';
    }
  },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);