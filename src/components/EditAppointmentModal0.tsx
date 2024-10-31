import React, { useState, useEffect } from 'react';

interface EditAppointmentModalProps {
  appointment: any;
  onClose: () => void;
  onSave: (updatedAppointment: any) => void;
}

const EditAppointmentModal0: React.FC<EditAppointmentModalProps> = ({ appointment, onClose, onSave }) => {
  const [time, setTime] = useState(appointment.time);
  const [vetId, setVetId] = useState(appointment.vet_id?.id || '');
  const [observation, setObservation] = useState(appointment.observation || '');
  const [vaccines, setVaccines] = useState<string[]>(appointment.vaccines ? appointment.vaccines.split(',').map((v: string) => v.trim()) : []);
  const [allergies, setAllergies] = useState(appointment.allergies || '');
  const [diseases, setDiseases] = useState(appointment.diseases || '');
  const [vets, setVets] = useState<any[]>([]);
  const [appliedVaccines, setAppliedVaccines] = useState<string[]>([]); // Vacunas ya aplicadas (no editables)

  useEffect(() => {
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

    // Fetch the vaccination record (Ficha) related to the pet in the appointment
    const fetchVaccinationRecord = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/fichas?pet_id=${appointment.pet_id.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const ficha = data[0]; // Tomamos la primera ficha de la lista (en caso de que haya más de una)

      if (ficha) {
        setAppliedVaccines(ficha.vacunas);  // Vacunas aplicadas
        setVaccines(ficha.vacunas);         // Vacunas actuales para editar
        setAllergies(ficha.alergias);       // Alergias
        setDiseases(ficha.enfermedades);    // Enfermedades
      }
    };

    fetchVets();
    fetchVaccinationRecord();
  }, [appointment.pet_id.id]);

  const handleSave = () => {
    const updatedAppointment = {
      ...appointment,
      time,
      vet_id: vetId,
      observation,
      vaccines,
      allergies,
      diseases,
    };
    
    onSave(updatedAppointment); // Llamada a la función de actualización que viene de AppointmentList
  };
  

  const handleVaccineChange = (vaccine: string) => {
    setVaccines((prevVaccines) =>
      prevVaccines.includes(vaccine)
        ? prevVaccines.filter((v) => v !== vaccine)
        : [...prevVaccines, vaccine]
    );
  };

return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-3/4 flex flex-col">
        <div className="flex">
          {/* Parte izquierda para editar la cita */}
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl font-bold mb-4">Editar Cita</h2>
            
            <div className="mb-4">
              <label className="block mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Veterinario</label>
              <select
                value={vetId}
                onChange={(e) => setVetId(e.target.value)}
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

            <div className="mb-4">
              <label className="block mb-1">Observación</label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Parte derecha para la ficha de vacunación */}
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Ficha de Vacunación</h2>

            <div className="mb-4">
              <label className="block mb-1">Vacunas</label>
              <div>
                {['Distemper', 'Parvovirosis', 'Rabia', 'Adenovirus', 'Leptospirosis'].map((vaccine) => (
                  <label key={vaccine} className="block">
                    <input
                      type="checkbox"
                      checked={vaccines.includes(vaccine)}
                      disabled={appliedVaccines.includes(vaccine)} // Las vacunas aplicadas no se pueden modificar
                      onChange={() => handleVaccineChange(vaccine)}
                    />
                    {vaccine}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Alergias</label>
              <textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Enfermedades</label>
              <textarea
                value={diseases}
                onChange={(e) => setDiseases(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Botones en la parte de abajo */}
        <div className="flex justify-end w-full">
          <button onClick={onClose} className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditAppointmentModal0;
