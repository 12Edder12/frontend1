import React from 'react';

const DashboardHome: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <div className="dashboard-home">
      <h1>Bienvenido al Dashboard</h1>
      {role === '1' && <p>Eres un veterinario con privilegios de administrador.</p>}
      {role === '2' && <p>Eres un asistente con permisos restringidos.</p>}
    </div>
  );
};

export default DashboardHome;