import React, { useState, useEffect } from 'react';
import UserForm from './UserForm'; // Formulario para agregar/editar usuarios

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }

    const response = await fetch('http://localhost:3000/users',  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const data = await response.json();

    setUsers(data);
    setFilteredUsers(data); 
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredUsers(users); // Si el campo de búsqueda está vacío, mostrar todos
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        user.email.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const token = localStorage.getItem('token');

  const handleDelete = async (id: number) => {
   
    await fetch(`http://localhost:3000/users/${id}`, { 
      method: 'DELETE',  
      headers: {
        Authorization: `Bearer ${token}`,
      },
     });
    fetchUsers(); // Refresca la lista después de eliminar
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Limpiar el formulario cuando se cierra el modal
  };

  const handleAddUser = () => {
    setSelectedUser(null); // Limpiar el formulario para agregar un nuevo usuario
    setIsModalOpen(true);
  };

  return (
    <div className="user-list">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre o email"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border"
      />

      <button 
        onClick={handleAddUser} 
        className="mb-4 p-2 bg-blue-500 text-white"
      >
        Agregar Usuario
      </button>

      <table className="min-w-full border">
        <thead>
          <tr>
           
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rol</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.role ? user.role.name : 'Sin rol asignado'}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="mr-2 p-1 bg-yellow-500 text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
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
            <UserForm
              user={selectedUser}
              onClose={handleCloseModal}
              onSave={fetchUsers}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
