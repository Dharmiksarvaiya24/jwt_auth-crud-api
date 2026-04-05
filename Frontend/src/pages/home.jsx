import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/details');
      const data = await response.json();
      setFlights(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch flights');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Flight Booking</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

       <button onClick={handleLogout} className="bg-green-500 text-white px-4 py-2 rounded mb-8">
            ADD FLIGHT
          </button>
          
        {loading && <p className="text-gray-600">Loading flights...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((flight) => (
            <div key={flight._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">{flight.name}</h3>
              <p className="text-gray-600">Time: {flight.time}</p>
              <p className="text-gray-600">From: {flight.departure}</p>
              <p className="text-gray-600">To: {flight.arrival}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;