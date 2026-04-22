import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GridVignetteBackground } from '@/components/ui/vignette-grid-background';
import AddFlightModal from '../components/AddFlightModal';
import EditFlightModal from '../components/EditFlightModal';

const API_BASE = import.meta.env.VITE_API_URL || 'https://curd-api-chc6.onrender.com';

const Home = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingFlight, setEditingFlight] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleTokenRefresh = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE}/user/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      return true;
    } catch {
      return false;
    }
  }, []);

  const fetchFlights = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/api/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        const refreshed = await handleTokenRefresh();
        if (refreshed) return fetchFlights();
        navigate('/login');
        return;
      }

      const data = await response.json();
      setFlights(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  }, [handleTokenRefresh, navigate]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleDelete = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      let response = await fetch(`${API_BASE}/api/details/${flightId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          response = await fetch(`${API_BASE}/api/details/${flightId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          });
        } else {
          navigate('/login');
          return;
        }
      }

      if (response.ok) {
        setFlights((prev) => prev.filter((f) => f._id !== flightId));
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Failed to delete flight');
      }
    } catch (err) {
      alert('Error deleting flight: ' + err.message);
    }
  };

 const handleEdit = (flight) => {
    setEditingFlight(flight);
    setIsEditModalOpen(true);
 }

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingFlight(null);
  };

  const handleEditComplete = (updatedFlight) => {
    setFlights((prev) =>
      prev.map((f) => (f._id === updatedFlight._id ? updatedFlight : f))
    );
    handleEditClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'traveler';

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

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.7)] backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">
                Flight Dashboard
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Welcome back, {username}
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                Manage your departures, arrivals, and schedules from one calm control
                panel with a cleaner view of every route.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="rounded-[1.5rem] border border-slate-700 bg-slate-800 px-5 py-4 text-white shadow-lg shadow-black/40">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Flights Tracked
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {loading ? '...' : flights.length}
                </p>
              </div>

              <AddFlightModal
                apiBase={API_BASE}
                refreshToken={handleTokenRefresh}
                onUnauthorized={() => navigate('/login')}
                onCreated={(flight) => setFlights((prev) => [flight, ...prev])}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="h-12 rounded-xl px-5 shadow-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </section>

        <EditFlightModal
          apiBase={API_BASE}
          refreshToken={handleTokenRefresh}
          onUnauthorized={() => navigate('/login')}
          onUpdated={handleEditComplete}
          flight={editingFlight}
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
        />

        {loading && (
          <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/70 px-5 py-4 text-slate-300 shadow-sm backdrop-blur">
            Loading flights...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-[1.5rem] border border-red-900 bg-red-950/85 px-5 py-4 text-red-300 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && flights.length === 0 ? (
          <div className="mt-6 flex flex-1 items-center justify-center rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/65 px-6 py-16 text-center shadow-sm backdrop-blur">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">
                Empty Manifest
              </p>
              <h3 className="mt-4 text-3xl font-semibold text-white">
                Your dashboard is ready for its first flight.
              </h3>
              <p className="mt-3 text-slate-400">
                Use the Add Flight action above to create a route and start tracking
                your schedule from here.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 xl:grid-cols-3">
            {flights.map((flight) => (
              <article
                key={flight._id}
                className="group rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6 shadow-lg shadow-black/60 backdrop-blur-md transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
                        Flight
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {flight.id}
                      </h3>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(flight)}
                        className="rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(flight._id)}
                        className="rounded-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                        Departure
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {flight.departure}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                        Arrival
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {flight.arrival}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                        Time
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {flight.time}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
