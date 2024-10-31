import React, { useEffect, useState } from 'react';
import PetForm from './PetForm';
import VaccinationRecord from './VaccinationRecord'; // Asegúrate de importar la ficha de vacunación
import imagen from './imagen.png'; // Asegúrate de que la ruta sea correcta

interface PetListProps {
  onSelectPet: (petId: number) => void;
}

const PetList: React.FC<PetListProps> = ({ onSelectPet }) => {
  const [pets, setPets] = useState<any[]>([]);
  const [filteredPets, setFilteredPets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<any | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null); // Para la ficha de vacunación

  
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de autenticación.');
        }

        const response = await fetch('http://localhost:3000/pets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener las mascotas.');
        }

        const data = await response.json();
        setPets(data);
        setFilteredPets(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }

      if(loading){
        return <p>Cargando...</p>
      }

    };

    useEffect(() => {
    fetchPets();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPets(pets.filter(pet => pet.name.toLowerCase().includes(value)));
  };

  const handleEdit = (pet: any) => {
    setInitialData(pet);
    setSelectedPetId(pet.id);
    setShowForm(true);
  };

  const handleFormSubmit = async (petData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró un token de autenticación.');
      return;
    }

    const method = initialData ? 'PATCH' : 'POST';
    const url = initialData
      ? `http://localhost:3000/pets/${initialData.id}`
      : 'http://localhost:3000/pets';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });

    if (response.ok) {
      await fetchPets(); 
      setShowForm(false);
      setInitialData(null);
    } else {
      const errorData = await response.json();
      console.error('Error al guardar la mascota:', errorData.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Mascotas</h2>
      {error && <p className="error-message text-red-500">{error}</p>}

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Buscar mascota..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded px-4 py-2 mr-2 w-full"
        />
        <button
          onClick={() => {
            setShowForm(true);
            setInitialData(null); 
            setSelectedPetId(null); 
          }}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Agregar nueva mascota
        </button>
      </div>

      <ul className="space-y-2">
        {filteredPets.map((pet) => (
          <li
            key={pet.id}
            className="flex justify-between items-center p-4 border border-gray-200 rounded"
          >
            <span>{pet.name} - {pet.type} - {pet.breed}</span>
            <div>
              <button
                onClick={() => handleEdit(pet)}
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 mr-2"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Mostrar los modales cuando se selecciona una mascota */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="flex bg-white rounded-lg shadow-lg w-full max-w-6xl">
            {/* Modal del formulario de edición o creación */}
            <div className="w-1/2 p-6 border-r">
              <h3 className="text-xl font-bold mb-4">
                {initialData ? 'Editar Mascota' : 'Agregar Mascota'}
              </h3>
              <PetForm onSubmit={handleFormSubmit} initialData={initialData} />
              <button
                onClick={() => setShowForm(false)}
                className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>

            {/* Mostrar imagen y detalles de la mascota si se está creando una nueva */}
            <div className="w-1/2 p-6">
              <h3 className="text-xl font-bold mb-4">
                {initialData ? 'Ficha de Vacunación' : 'Mascota Nueva'}
              </h3>
              {initialData ? (
                selectedPetId && <VaccinationRecord petId={selectedPetId} />
              ) : (
                <div>
                  <img src={imagen} alt="Imagen mascota" className="w-64 h-64 object-cover mb-4" />
                  <p className="text-gray-600">Estás creando una nueva mascota.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetList;
