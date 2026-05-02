import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GridVignetteBackground } from '@/components/ui/vignette-grid-background';

const API_BASE = import.meta.env.VITE_API_URL || 'https://curd-api-chc6.onrender.com';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user info from local storage
    const storedName = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    
    setUser({
      name: storedName || 'User',
      email: storedEmail || 'No email',
      createdAt: new Date()
    });
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Traveler';
  const userInitial = String(username).charAt(0).toUpperCase();

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-black px-4 py-6 sm:px-6 lg:px-8">
      <GridVignetteBackground
        className="opacity-100"
        x={50}
        y={18}
        intensity={68}
        horizontalVignetteSize={90}
        verticalVignetteSize={65}
      />

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
        {/* Header */}
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.7)] backdrop-blur-md sm:p-8">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white transition text-2xl"
              aria-label="Go back"
            >
              ←
            </button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Settings
              </h1>
              <p className="mt-2 text-slate-300">Manage your account and preferences</p>
            </div>
          </div>
        </section>

        {/* Content */}
        {loading && (
          <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/70 px-5 py-4 text-slate-300 shadow-sm backdrop-blur">
            Loading your profile...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-[1.5rem] border border-red-900 bg-red-950/85 px-5 py-4 text-red-300 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && user && (
          <div className="mt-6 space-y-6 pb-6">
            {/* Profile Card */}
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.7)] backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-3xl font-semibold text-white">
                  {userInitial}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-400">
                    Account
                  </p>
                  <h2 className="text-2xl font-semibold text-white">{user.name || username}</h2>
                  <p className="text-slate-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.7)] backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                    Name
                  </p>
                  <p className="mt-2 text-base text-white">{user.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                    Email
                  </p>
                  <p className="mt-2 text-base text-white">{user.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-[2rem] border border-red-900 bg-red-950/30 p-8 shadow-[0_30px_120px_-48px_rgba(127,29,29,0.5)] backdrop-blur-md">
              <h3 className="text-lg font-semibold text-red-300 mb-4">Danger Zone</h3>
              <p className="text-sm text-red-200 mb-6">
                Once you log out, you'll need to sign in again to access your account.
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="w-full h-12 rounded-xl"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
