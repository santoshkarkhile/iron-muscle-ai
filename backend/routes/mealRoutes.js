const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

router.get('/daily-stats/:userId', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meals = await Meal.find({
      userId: req.params.userId,
      createdAt: { $gte: today }
    });

    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    res.json(totals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;