import React from 'react';

const DashboardAsistente: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <h1>Dashboard Asistente</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {/* Contenido específico para asistentes */}
    </div>
  );
};

export default DashboardAsistente;
