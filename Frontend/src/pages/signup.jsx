import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
  
const API_BASE = import.meta.env.VITE_API_URL || 'https://curd-api-chc6.onrender.com';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // OTP flow: backend returns needsOtp instead of tokens
      if (data.needsOtp) {
        sessionStorage.setItem('pendingEmail', data.email || formData.email);
        sessionStorage.setItem('pendingPurpose', data.purpose || 'signup');
        navigate('/otp');
        return;
      }

      // Fallback (if backend still returns tokens directly)
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        if (data.user?.name) localStorage.setItem('username', data.user.name);
        navigate('/home');
        return;
      }

      throw new Error('Unexpected response from server');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 h-auto flex flex-col items-center shadow-xl p-8">
        <img src="https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-airplane-icon-png-image_1024816.jpg" alt="Signup Icon" className="w-10 h-10" />
        <h2 className="mt-4 text-2xl font-bold text-center">Sign Up</h2>
        <h5 className="text-lg text-gray-600 text-center">Create your account</h5>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
