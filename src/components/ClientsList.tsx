import React, { useState, useEffect } from 'react';
import OwnerForm from './ClientsForm'; // Asegúrate de importar el formulario de dueños

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null); // Estado para el dueño seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }

    const response = await fetch('http://localhost:3000/clients',  {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    setClients(data);
    setFilteredClients(data); 
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredClients(clients); // Si el campo de búsqueda está vacío, mostrar todos
    } else {
      const filtered = clients.filter((client) =>
        client.nombre.toLowerCase().includes(event.target.value.toLowerCase()) ||
        client.correo.toLowerCase().includes(event.target.value.toLowerCase()) ||
        client.id.includes(event.target.value) 
      );
      setFilteredClients(filtered);
    }
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const token = localStorage.getItem('token');

  const handleDelete = async (id: number) => {
   
    await fetch(`http://localhost:3000/clients/${id}`, { 
      method: 'DELETE',  
      headers: {
        Authorization: `Bearer ${token}`,
      },
     });
    fetchClients();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null); // Limpiar el formulario cuando se cierra el modal
  };

  const handleAddClient = () => {
    setSelectedClient(null); // Limpiar el formulario para agregar un nuevo usuario
    setIsModalOpen(true);
  };

  return (
    <div className="client-list">
      <h2 className="text-2xl font-bold mb-4">Clientes</h2>

{/* Buscador */}
<input
        type="text"
        placeholder="Buscar por nombre o email"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border"
      />

      <button 
        onClick={handleAddClient} 
        className="mb-4 p-2 bg-blue-500 text-white"
      >
        Agregar Usuario
      </button>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">

           <th className="py-2 px-4 border">Cedula</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Apellido</th>
            <th className="py-2 px-4 border">Correo</th>
            <th className="py-2 px-4 border">Teléfono</th>
            <th className="py-2 px-4 border">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map(client => (
            <tr key={client.id} >
              <td className="py-2 px-4 border">{client.id}</td>
              <td className="py-2 px-4 border">{client.nombre}</td>
              <td className="py-2 px-4 border">{client.apellido}</td>
              <td className="py-2 px-4 border">{client.correo}</td>
              <td className="py-2 px-4 border">{client.telefono}</td>
              <td className="py-2 px-4 border">{client.direccion}

              </td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleEdit(client)}
                  className="mr-2 p-1 bg-yellow-500 text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                   className="p-1 bg-red-500 text-white"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/* Modal para el formulario */}
{isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500"
            >
              X
            </button>
            <OwnerForm
              client={selectedClient}
              onClose={handleCloseModal}
              onSave={fetchClients}
            />
          </div>
        </div>
      )}


    </div>
  );
};

export default ClientList;
