import { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { auth, provider, signInWithPopup } from '../firebase';

export default function Onboarding() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // This pops up the Google Login window!
      await signInWithPopup(auth, provider); 
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 text-center space-y-6">
        
        <Zap className="w-16 h-16 text-yellow-400 mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Iron Muscle AI</h1>
          <p className="text-gray-400">Your intelligent fitness and nutrition coach.</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg flex items-center justify-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Connecting..." : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </button>

      </div>
    </div>
  );
}