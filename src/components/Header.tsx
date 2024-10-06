import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>Panel de Veterinario</h1>
      <div className="user-info">
        <span>Bienvenido, Veterinario</span>
        <button className="logout-button">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Header;