const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  icon: {
    type: Number,
    default: 0,
  },
  world1: {
    type: Number,
    default: 0,
  },
  world2: {
    type: Number,
    default: 0,
  },
  world3: {
    type: Number,
    default: 0,
  },
  flowered: {
    type: Number,
    default: 0,
  },
  tree: {
    type: Number,
    default: 0,
  },
  trash: {
    type: Number,
    default: 0,
  },
  fired: {
    type: Number,
    default: 0,
  },
  minigame: {
    type: Number,
    default: 0,
  },
  talked: {
    type: Number,
    default: 0,
  },
  water: {
    type: Number,
    default: 0,
  },
  fire: {
    type: Number,
    default: 0,
  },
  earth: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('User', UserSchema);
