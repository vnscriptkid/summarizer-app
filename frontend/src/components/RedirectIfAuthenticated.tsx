import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated; 