import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/admin/login/`, {
        username,
        password,
      });

      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        navigate('/admin/products');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrapper bg-slate-950 dark:bg-slate-950 light:bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="section-title mb-2">Admin Login</h1>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/10 light:border-slate-300 text-white light:text-slate-900 placeholder:text-slate-500 light:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/10 light:border-slate-300 text-white light:text-slate-900 placeholder:text-slate-500 light:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials info */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              Username: <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300">admin</code>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              Password: <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300">admin123</code>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
