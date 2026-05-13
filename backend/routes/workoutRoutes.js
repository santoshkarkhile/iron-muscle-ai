const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// --- POST: Log a new gym check-in ---
router.post('/', async (req, res) => {
    try {
        const { userId, status, workoutType, durationMinutes } = req.body;

        // 1. Basic Validation
        if (!userId || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // 2. Create and Save the Workout
        const newWorkout = new Workout({
            userId,
            status, // 'Completed', 'Rest Day', or 'Missed'
            workoutType: workoutType || 'General',
            durationMinutes: durationMinutes || 0
        });

        await newWorkout.save();
        console.log(`✅ Workout logged for user: ${userId} | Status: ${status}`);

        res.status(201).json({ success: true, workout: newWorkout });
    } catch (error) {
        console.error("❌ Error saving workout:", error);
        res.status(500).json({ success: false, message: "Server error while logging workout." });
    }
});

// --- GET: Fetch a user's recent workout history (For our ADK Agent!) ---
router.get('/:userId', async (req, res) => {
    try {
        // We limit to the last 7 days to keep the AI context window clean and fast
        const recentWorkouts = await Workout.find({ userId: req.params.userId })
            .sort({ date: -1 }) // Sorts newest to oldest
            .limit(7);

        res.status(200).json({ success: true, history: recentWorkouts });
    } catch (error) {
        console.error("❌ Error fetching workouts:", error);
        res.status(500).json({ success: false, message: "Server error fetching history." });
    }
});

module.exports = router;