import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de inicio de sesión. Verifica tus credenciales.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);

      // Decodificar el JWT para obtener el rol
      const decodedToken = JSON.parse(atob(data.access_token.split('.')[1]));

      // Redirigir según el rol
      if (decodedToken.role === 1) {
        navigate('/dashboard/admin'); // Ruta para el veterinario
      } else if (decodedToken.role === 2) {
        navigate('/dashboard/assistant'); // Ruta para el asistente
      } else {
        setErrorMessage('Rol desconocido. Contacta con el administrador.');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error('Error de inicio de sesión:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Inicio de Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
