import React, { useState, useEffect } from 'react';

interface AppointmentFormProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ selectedDate, onClose, onSave }) => {
  const [petId, setPetId] = useState('');
  const [vetId, setVetId] = useState('');
  const [observation, setObservation] = useState('');
  const [pets, setPets] = useState<any[]>([]);
  const [vets, setVets] = useState<any[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/pets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPets(data);
    };

    const fetchVets = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setVets(data);
    };

    fetchPets();
    fetchVets();
  }, []);

  const handleSave = () => {
    const appointmentData = {
      date: selectedDate.toISOString().substring(0, 10),
      time: selectedDate.toTimeString().substring(0, 5), 
      pet_id: petId, 
      vet_id: vetId,
      observations: observation,
    };
    onSave(appointmentData);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Crear Cita</h2>

        {/* Hora de la cita */}
        <div className="mb-4">
          <label className="block mb-1">Hora</label>
          <input
            type="text"
            value={selectedDate.toTimeString().substring(0, 5)} // Mostramos la hora seleccionada
            disabled
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Selección de mascota */}
        <div className="mb-4">
          <label className="block mb-1">Mascota</label>
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona una mascota</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.id} - {pet.name} ({pet.breed})
              </option>
            ))}
          </select>
        </div>

        {/* Selección de veterinario */}
        <div className="mb-4">
          <label className="block mb-1">Veterinario</label>
          <select
            value={vetId}
            onChange={(e) => setVetId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona un veterinario</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.id} - {vet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Observación */}
        <div className="mb-4">
          <label className="block mb-1">Observación</label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
