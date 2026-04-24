const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');

// --- MULTER SETUP ---
// This configures multer to hold the uploaded image in memory 
// so we can immediately send it to Gemini without saving it to your hard drive.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- ROUTES ---

// Health Check
router.get('/health', (req, res) => {
    res.json({ status: 'success', message: 'API is healthy!' });
});

// The Core Feature: Analyze Meal
// When the frontend hits POST /api/analyze-meal, multer grabs the 'image' file first, then runs the AI controller.
router.post('/analyze-meal', upload.single('image'), aiController.analyzeMeal);

module.exports = router;