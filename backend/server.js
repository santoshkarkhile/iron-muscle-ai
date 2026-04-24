require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const User = require('./models/User');
const apiRoutes = require('./routes/apiRoutes');
const mealRoutes = require('./routes/mealRoutes');
const app = express();

// --- MIDDLEWARES ---
// CORS allows your React frontend to communicate with this Node backend
app.use(cors()); 
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- AUTOMATED DAILY RESET (CRON JOB) ---
// This runs exactly at 00:00 (Midnight) IST (Asia/Kolkata) every single day
cron.schedule('0 0 * * *', async () => {
    console.log('⏳ Running daily macro reset cron job...');
    try {
        // Resets everyone's daily stats to 0 at midnight
        await User.updateMany({}, {
            $set: { todayCalories: 0, todayProtein: 0, todayCarbs: 0, todayFiber: 0 }
        });
        console.log('✅ Daily macros reset successfully for all users.');
    } catch (error) {
        console.error('❌ Error resetting daily macros:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// --- ROUTES (Placeholders for now) ---
// --- ROUTES ---
app.use('/api', apiRoutes); // This hooks up your apiRoutes.js file
app.use('/api',mealRoutes);

app.get('/', (req, res) => {
    res.send('💪 Iron Muscle AI Backend is running!');
});
// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});