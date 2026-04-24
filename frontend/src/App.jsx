import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This "listens" to Firebase. If a user logs in or out, this updates instantly.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p className="animate-pulse">Loading Iron Muscle AI...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* If user exists, go to Dashboard. Otherwise, go to Setup (Login) */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/setup" />} 
        />
        
        {/* We "protect" the dashboard so you can't see it unless logged in */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/setup" />} 
        />
        
        <Route 
          path="/setup" 
          element={!user ? <Onboarding /> : <Navigate to="/dashboard" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;