import React, { useState, useEffect } from 'react';

interface UserFormProps {
  user: any;
  onClose: () => void;
  onSave: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    username: string;
    password?: string; 
    rol_id: number;
    }>({
    name: '',
    email: '',
    username: '',
    password: '',
    rol_id: 1, // Por defecto admin
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        password: '',
        rol_id: user.rol_id,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const updatedFormData = { ...formData };
    
    if (!updatedFormData.password) {
      delete updatedFormData.password; // No enviar contraseña si está vacía
    }

    if (user) {
      // Editar usuario
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH', // Cambiado a PATCH
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });
      alert('Usuario actualizado correctamente');
    } else {
      // Agregar nuevo usuario
      await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });
    }
    onSave(); 
    onClose(); 
};

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl mb-4">{user ? 'Editar Usuario' : 'Agregar Usuario'}</h2>

      <label className="block mb-2">Nombre:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="mb-4 p-2 border"
      />

      <label className="block mb-2">Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="mb-4 p-2 border"
      />

      <label className="block mb-2">Username:</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="mb-4 p-2 border"
      />

      <label className="block mb-2">Contraseña:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="mb-4 p-2 border"
      />

      <label className="block mb-2">Rol:</label>
      <select
        name="rol_id"
        value={formData.rol_id}
        onChange={handleChange}
        className="mb-4 p-2 border"
      >
        <option value={1}>Admin</option>
        <option value={2}>Asistente</option>
      </select>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="mr-4 p-2 bg-gray-300"
        >
          Cancelar
        </button>
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Guardar
        </button>
      </div>
    </form>
  );
};

export default UserForm;
