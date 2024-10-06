import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>Veterinario</h2>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard/home">Inicio</Link>
          </li>
          <li>
            <Link to="/dashboard/pets">Gestión de Mascotas</Link>
          </li>
          <li>
            <Link to="/dashboard/owners">Gestión de Dueños</Link>
          </li>
          <li>
            <Link to="/dashboard/appointments">Gestión de Citas</Link>
          </li>
          <li>
            <Link to="/dashboard/medical-records">Fichas Médicas</Link>
          </li>
          <li>
            <Link to="/dashboard/settings">Configuraciones</Link>
          </li>
          <li>
            <Link to="/">Cerrar Sesión</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;