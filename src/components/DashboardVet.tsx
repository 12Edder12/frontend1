import React from 'react';

const DashboardVeterinario: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <h1>Dashboard Veterinario</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {/* Contenido específico para veterinarios */}
    </div>
  );
};

export default DashboardVeterinario;
