import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://curd-api-chc6.onrender.com';

const OTP_LENGTH = 4;

const Otp = () => {
  const navigate = useNavigate();
  const pendingEmail = useMemo(() => sessionStorage.getItem('pendingEmail') || '', []);
  const pendingPurpose = useMemo(() => sessionStorage.getItem('pendingPurpose') || '', []);
  const [digits, setDigits] = useState(Array.from({ length: OTP_LENGTH }, () => ''));
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const otpValue = digits.join('');

  const focusIndex = (index) => {
    const element = inputRefs.current[index];
    if (element) element.focus();
  };

  const handleChange = (index, value) => {
    setError('');
    const nextChar = String(value).replace(/\D/g, '').slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = nextChar;
    setDigits(nextDigits);

    if (nextChar && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusIndex(index - 1);
    }
  };

  const handlePaste = (e) => {
    setError('');
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const nextDigits = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || '');
    setDigits(nextDigits);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    focusIndex(nextIndex);

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter 4-digit OTP.');
      return;
    }

    if (!pendingEmail || !pendingPurpose) {
      setError('No pending verification found. Please login/signup again.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp: otpValue, purpose: pendingPurpose })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.user?.name) localStorage.setItem('username', data.user.name);

      sessionStorage.removeItem('pendingEmail');
      sessionStorage.removeItem('pendingPurpose');

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-sm h-auto flex flex-col items-center shadow-xl p-8">
        <img
          src="https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-airplane-icon-png-image_1024816.jpg"
          alt="OTP Icon"
          className="w-10 h-10"
        />

        <h2 className="mt-3 text-2xl font-bold text-center">Enter OTP</h2>
        <p className="mt-1 text-sm text-gray-600 text-center">
          {pendingEmail ? `We sent a 4-digit code to ${pendingEmail}` : 'We sent a 4-digit code to your email'}
        </p>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="w-full mt-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
                className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setMessage('If you did not receive OTP, please try login/signup again.')}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
            <Link to="/login" className="text-gray-600 hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Otp;
