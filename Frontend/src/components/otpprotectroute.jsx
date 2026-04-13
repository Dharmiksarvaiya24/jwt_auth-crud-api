import React from 'react';
import { Navigate } from 'react-router-dom';

const OtpProtectRoute = ({ children }) => {
  const pendingEmail = sessionStorage.getItem('pendingEmail');
  const pendingPurpose = sessionStorage.getItem('pendingPurpose');

  if (!pendingEmail || !pendingPurpose) {
    return <Navigate to="/*" replace />;
  }

  return children;
};

export default OtpProtectRoute;

