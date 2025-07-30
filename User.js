const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
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
  role: {
    type: String,
    enum: ['user', 'volunteer'],
    required: true
  },
  areaOfOperation: {
    type: String,
    required: function() {
      return this.role === 'volunteer';
    }
  },
  location: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

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
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  photoUrl: String,
  donationType: {
    type: String,
    enum: ['user_donate', 'volunteer_collect'],
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
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Donation = mongoose.model('Donation', donationSchema);

module.exports = { User, Donation };