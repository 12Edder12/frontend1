import React from 'react';
import './DashboardHome.css';

const DashboardHome: React.FC = () => {
  return (
    <div className="dashboard-home">
      <h2>Resumen del día</h2>
      <p>Bienvenido al panel del veterinario. Aquí puedes gestionar todas las operaciones relacionadas con tus pacientes.</p>
    </div>
  );
};

export default DashboardHome;