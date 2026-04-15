import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFlightModal from '../components/AddFlightModal';

const API_BASE = import.meta.env.VITE_API_URL || 'https://curd-api-chc6.onrender.com';

const Home = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

 const handleEdit = () =>{
    alert('Edit functionality is not implemented yet.');
 }

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome {localStorage.getItem('username')} </h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

        <AddFlightModal
          apiBase={API_BASE}
          refreshToken={handleTokenRefresh}
          onUnauthorized={() => navigate('/login')}
          onCreated={(flight) => setFlights((prev) => [flight, ...prev])}
        />
	          
        {loading && <p className="text-gray-600">Loading flights...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((flight) => (
		            <div key={flight._id} className="bg-white p-6 rounded-lg shadow-md relative pr-24">
              <h3 className="text-xl font-bold mb-2">{flight.id}</h3>
              <p className="text-gray-600">Time: {flight.time}</p>
              <p className="text-gray-600">From: {flight.departure}</p>
              <p className="text-gray-600">To: {flight.arrival}</p>
              
		              <div className="absolute right-6 top-6 flex items-center justify-start gap-4 flex-col">
	                <button onClick={handleEdit} className="cursor-pointer flex items-center gap-2 text-blue-600">
	                  <img
	                    src="data:image/png;base64,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"
	                    alt="Edit"
	                    className="w-10 h-6"
	                  />
	                 
	                </button>
	                <button onClick={() => handleDelete(flight._id)} className="cursor-pointer flex items-center gap-2 text-red-600">
	                  <img
	                    src="data:image/png;base64,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"
	                    alt="Delete"
	                    className="w-6 h-6"
	                  />
	                </button>
	              </div>
	              </div>
	          ))}
	        </div>
      </div>
    </div>
  );
};

export default Home;
