import React, { useState, useEffect } from 'react';

interface PetFormProps {
  initialData: any | null;
  onSubmit: (petData: any) => Promise<void>;
}

const PetForm: React.FC<PetFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [breed, setBreed] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [weight, setWeight] = useState<number>(0);
  const [sex, setSex] = useState<string>('M');
  const [ownerId, setOwnerId] = useState<string | null>(null); // ID del dueño
  const [ownerDetails, setOwnerDetails] = useState<any | null>(null); // Detalles del dueño
  const [ownerError, setOwnerError] = useState<string>(''); // Error si no se encuentra dueño

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBreed(initialData.breed);
      setType(initialData.type);
      setWeight(initialData.weight);
      setSex(initialData.sex);
      setOwnerId(initialData.ownerId); // Cargar el ID del dueño en modo edición
      fetchOwnerDetails(initialData.ownerId); 
    } else {
      setName('');
      setBreed('');
      setType('');
      setWeight(0);
      setSex('M');
      setOwnerId(null);
      setOwnerDetails(null);
      setOwnerError('');
    }
  }, [initialData]);

  const fetchOwnerDetails = async (id: string | null) => {
    if (!id) {
      setOwnerDetails(null);
      setOwnerError('Por favor, ingresa un ID válido.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se encontró el dueño.');
      }

      const data = await response.json();
      setOwnerDetails(data); // Guardar los detalles del dueño
      setOwnerError(''); // Limpiar cualquier error
    } catch (error) {
      setOwnerDetails(null);
      setOwnerError('No se encontró un dueño con ese ID.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const petData = {
      name,
      breed,
      type,
      weight,
      sex,
      ownerId,
    };

    onSubmit(petData); // Llama a la función onSubmit para guardar
  };

  return (
    <form onSubmit={handleSubmit}>

 {/* ID del dueño */}
 <div className="mb-4">
        <label className="block text-gray-700">ID del Dueño:</label>
        {/* Si estamos en modo edición, el ID del dueño es de solo lectura */}
        {initialData ? (
          <input
            type="text"
            value={ownerId?.toString() ?? ''}
            readOnly
            className="border rounded px-4 py-2 w-full bg-gray-200 cursor-not-allowed"
          />
        ) : (
          <input
            type="number"
            value={ownerId ?? ''}
            onChange={(e) => setOwnerId(String(e.target.value))}
            onBlur={() => fetchOwnerDetails(ownerId)} // Buscar dueño cuando se pierde el foco
            className="border rounded px-4 py-2 w-full"
          />
        )}
        {ownerError && <p className="text-red-500 mt-2">{ownerError}</p>}
      </div>

      {/* Mostrar detalles del dueño si es encontrado */}
      {ownerDetails && (
        <div className="mb-4 p-4 bg-gray-100 rounded shadow">
          <h4 className="text-gray-700">Detalles del Dueño:</h4>
          <p><strong>Nombre:</strong> {ownerDetails.nombre} {ownerDetails.apellido}</p>
          <p><strong>Correo:</strong> {ownerDetails.correo}</p>
          <p><strong>Teléfono:</strong> {ownerDetails.telefono}</p>
        </div>
      )}


      {/* Campos de la mascota */}
      <div className="mb-4">
        <label className="block text-gray-700">Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Raza:</label>
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Tipo:</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Peso (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Sexo:</label>
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="M">Macho</option>
          <option value="F">Hembra</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  );
};

export default PetForm;
