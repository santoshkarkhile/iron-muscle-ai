import { useState,useEffect } from 'react';
import { Upload, Loader2, Utensils, Zap } from 'lucide-react';
import { analyzeMealAPI, getDailyProgressAPI } from '../api';
import { auth } from '../firebase';


export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState(null);
  const [progress, setProgress] = useState(null);
  // Handle when the user picks a photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Creates a temporary URL to show the image
      setMealData(null); // Clear old results
    }
  };

  useEffect(() => {
  const fetchProgress = async () => {
    if (auth.currentUser) {
      try {
        const response = await getDailyProgressAPI(auth.currentUser.uid);
        // We need to map the backend response to our progress state
        setProgress(response.data);
      } catch (err) {
        console.error("No progress found for today yet.",err);
      }
    }
  };
  fetchProgress();
}, []);

  // Handle sending the photo to the backend
//   const handleAnalyze = async () => {
//     if (!selectedFile) return;
//     const response = await analyzeMealAPI(formData);
//     setMealData(response.data.meal);
//     setProgress(response.data.dailyProgress);
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('image', selectedFile);
//     formData.append('authId', auth.currentUser?.uid);

//     try {
//       const response = await analyzeMealAPI(formData);
//       setMealData(response.data.meal);
//     } catch (error) {
//       console.error("Error analyzing meal:", error);
//       alert("Failed to analyze meal. Is your backend running?");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleAnalyze = async () => {
    if (!selectedFile) return;

    // 1. Prepare the data FIRST
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('authId', auth.currentUser?.uid);

    // 2. Start loading
    setLoading(true);

    try {
      // 3. Make the API call
      const response = await analyzeMealAPI(formData);
      
      // 4. Update the UI with results
      setMealData(response.data.meal);
      setProgress(response.data.dailyProgress);
    } catch (error) {
      console.error("Error analyzing meal:", error);
      alert("Failed to analyze meal. Is your backend running?");
    } finally {
      // 5. Stop loading
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
                {/* User Profile Bar */}
        <div className="max-w-md mx-auto mb-4 flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700">
        <div className="flex items-center gap-3">
            <img 
            src={auth.currentUser?.photoURL} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <div>
            <p className="text-xs text-gray-400">Welcome back,</p>
            <p className="text-sm font-bold">{auth.currentUser?.displayName?.split(' ')[0]}</p>
            </div>
        </div>
        <button 
            onClick={() => auth.signOut()}
            className="text-xs bg-gray-700 hover:bg-red-900/50 text-gray-300 hover:text-red-400 py-1 px-3 rounded-lg transition"
        >
            Logout
        </button>
        </div>
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center justify-center gap-2">
            <Zap className="text-yellow-400" /> Iron Muscle AI
          </h1>
          <p className="text-gray-400">Upload your meal. We do the math.</p>
        </header>
                {/* Daily Progress Section */}
        {progress && (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4 mb-6">
            <div className="flex justify-between items-end">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Daily Progress</h3>
            <span className="text-xs text-blue-400 font-mono">
                {progress.todayCalories} / {progress.targetCalories} kcal
            </span>
            </div>

            {/* Calories Bar */}
            <div className="space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${Math.min((progress.todayCalories / progress.targetCalories) * 100, 100)}%` }}
                ></div>
            </div>
            </div>

            {/* Protein & Carbs Mini Bars */}
            <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Protein</span>
                <span className="text-white font-bold">{progress.todayProtein}g / {progress.targetProtein}g</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min((progress.todayProtein / progress.targetProtein) * 100, 100)}%` }}
                ></div>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Carbs</span>
                <span className="text-white font-bold">{progress.todayCarbs}g / {progress.targetCarbs}g</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                    className="bg-yellow-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min((progress.todayCarbs / progress.targetCarbs) * 100, 100)}%` }}
                ></div>
                </div>
            </div>
            </div>
        </div>
        )}

        {/* Upload Box */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Meal Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
          ) : (
            <div className="w-full h-48 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-600">
              <Utensils className="w-12 h-12 text-gray-500" />
            </div>
          )}

          {/* Hidden File Input & Custom Label Button */}
          <input 
            type="file" 
            id="meal-upload" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <label 
            htmlFor="meal-upload" 
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg cursor-pointer transition flex items-center justify-center gap-2 w-full mb-4"
          >
            <Upload size={20} /> Select Meal Photo
          </label>

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
              !selectedFile || loading 
                ? 'bg-blue-900/50 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Analyze Macros"}
          </button>
        </div>

        {/* Results Area */}
        {mealData && (
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-bold text-green-400 border-b border-gray-700 pb-2">
              {mealData.food_name || "Analysis Complete"}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Calories</p>
                <p className="text-2xl font-bold text-white">{mealData.calories}</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Protein</p>
                <p className="text-2xl font-bold text-blue-400">{mealData.protein}g</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Carbs</p>
                <p className="text-2xl font-bold text-yellow-400">{mealData.carbs}g</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Fiber</p>
                <p className="text-2xl font-bold text-green-400">{mealData.fiber}g</p>
              </div>
               <div className="bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Fats</p>
                <p className="text-2xl font-bold text-green-400">{mealData.fats}g</p>
              </div>
            </div>

            {/* AI Coach Roast */}
            {mealData.roast && (
              <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg mt-4 italic text-sm text-blue-200">
               &quot;{mealData.roast}&quot;
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}