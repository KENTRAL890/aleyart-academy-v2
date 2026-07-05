import { useState } from 'react';
import { login } from '../store';
import type { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(name, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #0d1642 100%)'
    }}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{
            background: 'linear-gradient(135deg, #ff6f00, #ffa040)',
            boxShadow: '0 8px 32px rgba(255,111,0,0.3)'
          }}>
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">ALEYART ACADEMY</h1>
          <p className="text-blue-200 text-xs italic mb-1">Motto: Seeking Wisdom</p>
          <p className="text-blue-200 text-sm">Exam Generation System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8" style={{
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  placeholder="Enter password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #1a237e, #3949ab)',
              }}
            >
              {loading ? '⏳ Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Default Credentials:</p>
            <div className="flex gap-3 mt-2 justify-center flex-wrap">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Admin / admin123</span>
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">Mr. Mensah / teacher123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">© 2025 Aleyart Academy. All rights reserved.</p>
      </div>
    </div>
  );
}
