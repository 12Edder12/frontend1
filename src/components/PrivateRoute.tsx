import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRoles: number[]; // Cambiado para aceptar múltiples roles
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    // Decodificar el token para verificar el rol
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userRole = decodedToken.role;

    // Verifica si el rol del usuario está en los roles requeridos
    if (requiredRoles.includes(userRole)) {
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
