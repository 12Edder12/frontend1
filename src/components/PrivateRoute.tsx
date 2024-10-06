import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole: number; // 1 para admin, 2 para assistant
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    // Decodificar el token para verificar el rol
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    if (decodedToken.role === requiredRole) {
      return children;
    } else {
      return <Navigate to="/error" replace />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/error" replace />;
  }
};

export default PrivateRoute;
