import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup:', formData);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 h-auto flex flex-col items-center shadow-xl p-8">
        <img src="https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-airplane-icon-png-image_1024816.jpg" alt="Signup Icon" className="w-10 h-10" />
        <h2 className="mt-4 text-2xl font-bold text-center">Sign Up</h2>
        <h5 className="text-lg text-gray-600 text-center">Create your account</h5>

        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
          <p className="text-sm text-gray-600 text-center">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;