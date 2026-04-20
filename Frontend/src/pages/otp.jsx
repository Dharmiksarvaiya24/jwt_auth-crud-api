import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackgroundPaths } from '../components/ui/background-paths';

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
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  const otpValue = digits.join('');

  const focusIndex = (index) => {
    const element = inputRefs.current[index];
    if (element) element.focus();
  };

  const handleChange = (index, value) => {
    setError('');
    setMessage('');
    const nextChar = String(value).replace(/\D/g, '').slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = nextChar;
    setDigits(nextDigits);

    if (nextChar && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusIndex(index - 1);
    } else if (e.key === 'Backspace' && digits[index]) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
    }
  };

  const handlePaste = (e) => {
    setError('');
    setMessage('');
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
      setError('Please enter a 4-digit OTP.');
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

      setMessage('✓ OTP verified successfully!');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendLoading(true);
    setResendDisabled(true);
    setCountdown(60);

    try {
      const response = await fetch(`${API_BASE}/user/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, purpose: pendingPurpose })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to resend OTP');

      setMessage(' OTP sent to your email');
      setDigits(Array.from({ length: OTP_LENGTH }, () => ''));
      focusIndex(0);

      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message);
      setResendDisabled(false);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <BackgroundPaths>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-sm bg-white/95 dark:bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center shadow-2xl p-6 sm:p-8 border border-black/10 dark:border-white/10">
         

          {/* Text */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white">Enter OTP</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-2 break-all">
            {pendingEmail 
              ? `We sent a 4-digit code to ${pendingEmail}` 
              : 'We sent a 4-digit code to your email'}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-4 w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-lg p-3 break-words flex items-start gap-2">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mt-4 w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-xs sm:text-sm rounded-lg p-3 break-words flex items-start gap-2">
              <span className="text-lg flex-shrink-0">✓</span>
              <span>{message}</span>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="w-full mt-6 sm:mt-8">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
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
	                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Submit Button */}
	            <button
	              type="submit"
	              disabled={loading || otpValue.length !== OTP_LENGTH}
	              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 sm:py-2.5 text-sm rounded-lg transition duration-200 active:scale-95 disabled:active:scale-100"
	            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Footer Actions */}
            <div className="mt-6 space-y-3 sm:space-y-4">
              {/* Resend OTP */}
              <div>
	                <button
	                  type="button"
	                  onClick={handleResendOTP}
	                  disabled={resendDisabled || resendLoading}
	                  className="w-full px-4 py-2 sm:py-2.5 text-sm border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
	                >
                  {resendLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : resendDisabled ? (
                    <span>Resend OTP in {countdown}s</span>
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>

              {/* Back to Login */}
              <div className="flex items-center justify-center">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
	                  Back to{' '}
	                  <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold transition">
	                    Login
	                  </Link>
                </span>
              </div>
            </div>
          </form>

       
        </div>
      </div>
    </BackgroundPaths>
  );
};

export default Otp;
