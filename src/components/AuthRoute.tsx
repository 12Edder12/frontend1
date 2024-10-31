import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Si el token existe, significa que el usuario está logueado, lo rediriges al Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está logueado, se muestra la página de login
  return children;
};

export default AuthRoute;
