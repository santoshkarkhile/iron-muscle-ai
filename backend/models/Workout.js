const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  }, 
  date: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Completed', 'Rest Day', 'Missed'], 
    required: true 
  },
  workoutType: { 
    type: String, 
    default: 'General'
  },
  durationMinutes: {
    type: Number,
    default: 0
  }
});

workoutSchema.index({ userId: 1, date: 1 }, { unique: false }); 

module.exports = mongoose.model('Workout', workoutSchema);