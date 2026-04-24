const Meal = require('../models/Meal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');

// Initialize Gemini with your secure API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Helper function to safely clean AI data (prevents database crashes)
const cleanNum = (val) => parseInt(String(val).replace(/[^0-9.]/g, '')) || 0;

exports.analyzeMeal = async (req, res) => {
    try {
        // 1. Check if the user exists (We will pass the authId from the frontend later)
        // For testing right now, we will just use a dummy ID if one isn't provided
        const authId = req.body.authId || "test-user-123"; 
        
        let user = await User.findOne({ authId: authId });
        
        // If testing and user doesn't exist, create a temporary one
        if (!user) {
            user = new User({ authId: authId, email: "test@test.com", targetCalories: 2000, targetProtein: 150, targetCarbs: 200, targetFiber: 30 });
            await user.save();
        }

        // 2. Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image provided." });
        }

        // 3. Prepare the image for Gemini (Convert memory buffer to base64)
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
            }
        };

        // 4. Send to Gemini 2.0 Flash
        const prompt = `Analyze this food image. Return JSON ONLY: { "food_name": "string", "calories": number, "protein": number, "carbs": number, "fats": number, "fiber": number, "roast": "short funny gym coach comment" }`;        
        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();

        // 5. Extract and Clean the JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI did not return valid JSON.");
        
        const data = JSON.parse(jsonMatch[0]);

        // Clean the numbers (removes 'g', 'kcal', etc.)
        data.calories = cleanNum(data.calories);
        data.protein = cleanNum(data.protein);
        data.carbs = cleanNum(data.carbs);
        data.fiber = cleanNum(data.fiber);
        data.fats = cleanNum(data.fats);
        const newMeal = new Meal({
        userId: req.body.authId, // Sent from our React frontend
        foodName: data.food_name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
        fiber: data.fiber,
        roast: data.roast
        });

        await newMeal.save();
        console.log("✅ Meal saved to MongoDB for user:", req.body.authId);

        // Send the response back to UI
        // res.json({
        // success: true,
        // meal: newMeal
        // });

        // 6. Update Database
        user.todayCalories += data.calories;
        user.todayProtein += data.protein;
        user.todayCarbs += data.carbs;
        user.todayFiber += data.fiber;
        user.todayFats += data.fats;
        await user.save();

        // 7. Send the success response back to React!
        res.status(200).json({
            success: true,
            meal: data,
            dailyProgress: {
                todayCalories: user.todayCalories,
                targetCalories: user.targetCalories,
                todayProtein: user.todayProtein,
                targetProtein: user.targetProtein,
                todayCarbs: user.todayCarbs,
                targetCarbs: user.targetCarbs,
                todayFiber: user.todayFiber,
                targetFiber: user.targetFiber,
                todayFats: user.todayFats,
                targetFats: user.targetFats

            }
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ success: false, message: "Failed to analyze meal. Please try again." });
    }
};