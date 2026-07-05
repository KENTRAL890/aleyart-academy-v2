import { useState, useEffect } from 'react';
import type { User } from './types';
import { getCurrentUser, startRealtimeSync } from './store';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SetupGuide from './components/SetupGuide';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUser(current);
    }
    setLoading(false);
    // Start real-time sync with Supabase
    startRealtimeSync();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)'
      }}>
        <div className="text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
            background: 'linear-gradient(135deg, #ff6f00, #ffa040)'
          }}>
            <span className="text-2xl animate-pulse">🎓</span>
          </div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <SetupGuide />
        <LoginPage onLogin={setUser} />
      </>
    );
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
