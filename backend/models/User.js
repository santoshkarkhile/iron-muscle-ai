const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  authId: { type: String, required: true, unique: true }, // From Firebase or Google Login
  email: { type: String, required: true },
  firstName: String,
  
  // Profile & Goals
  age: Number, 
  weight: Number, 
  height: Number,
  activityLevel: String, 
  dietaryPreference: String, 
  goal: String,
  
  // Calculated Targets
  targetCalories: Number, 
  targetProtein: Number, 
  targetCarbs: Number, 
  targetFiber: Number,
  targetFats: Number,
  // Daily Logs
  todayCalories: { type: Number, default: 0 },
  todayProtein: { type: Number, default: 0 },
  todayCarbs: { type: Number, default: 0 },
  todayFiber: { type: Number, default: 0 },
  todayFats:  {type: Number, default: 0 },
  // Monetization / Subscriptions
  isPremium: { type: Boolean, default: false },
  credits: { type: Number, default: 3 }, // 3 Free scans
  subscriptionExpiry: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);