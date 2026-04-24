const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Your Google UID from Firebase
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  fiber: { type: Number, required: true },
  roast: { type: String },
  imageUrl: { type: String }, // For now, we'll store the local path or empty
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);