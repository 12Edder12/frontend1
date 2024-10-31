import React, { useState, useEffect } from 'react';

interface OwnerFormProps {
  client: any;
  onClose: () => void;
  onSave: () => void;
}

const ClientForm: React.FC<OwnerFormProps> = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState<{
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
  }>({
    id: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        nombre: client.nombre,
        apellido: client.apellido,
        correo: client.correo,
        telefono: client.telefono,
        direccion: client.direccion,
      });
    }
  }, [client]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (client) {
      // Editar usuario
      await fetch(`http://localhost:3000/clients/${client.id}`, {
        method: 'PATCH', // Cambiado a PATCH
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      alert('Usuario actualizado correctamente');
    } else {
      // Agregar nuevo usuario
      await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
    }
    onSave(); 
    onClose(); 
};

  return (
    <form onSubmit={handleSubmit} className="owner-form container mx-auto my-4 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Formulario de Dueño</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Cédula</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          readOnly={!!client} // Hacer el campo de solo lectura si está en modo edición
        />
      </div>


      <div className="mb-4">
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Correo Electrónico</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">Guardar Dueño</button>
    </form>
  );
};

export default ClientForm;
