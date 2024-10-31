import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './imagen.png'; // Asegúrate de que la ruta de la imagen sea correcta

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
        navigate('/dashboard'); // Ruta para el veterinario
      } else if (decodedToken.role === 2) {
        navigate('/dashboard'); // Ruta para el asistente
      } else {
        setErrorMessage('Rol desconocido. Contacta con el administrador.');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error('Error de inicio de sesión:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-50" // Imagen de fondo
      />
      <div className="bg-blue-800 bg-opacity-60 backdrop-blur-lg p-6 rounded-lg shadow-md w-96 z-10"> {/* Fondo azul y desenfoque */}
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Inicio de Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
