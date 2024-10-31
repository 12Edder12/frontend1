import React, { useState, useEffect } from 'react';

interface EditAppointmentModalProps {
  appointment: any;
  onClose: () => void;
  onSave: (updatedAppointment: any) => void;
  onEditAppointment: (updatedAppointmentData: any) => void; 
  onUpdateAppointments: () => void; 
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ 
  appointment,
   onClose,
   onSave,
   onEditAppointment,
   onUpdateAppointments,
   }) => {
  const [time, setTime] = useState(appointment.time);
  const [vetId, setVetId] = useState(appointment.vet_id?.id || '');
  const [observation, setObservation] = useState(appointment.observation || '');
  const [vaccines, setVaccines] = useState<string[]>(appointment.vaccines ? appointment.vaccines.split(',').map((v: string) => v.trim()) : []);
  const [newVaccine, setNewVaccine] = useState<string>('');
  const [allergies, setAllergies] = useState(appointment.allergies || '');
  const [diseases, setDiseases] = useState(appointment.diseases || '');
  const [vets, setVets] = useState<any[]>([]);
  const [appliedVaccines, setAppliedVaccines] = useState<string[]>([]); 

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

    const fetchVaccinationRecord = async () => {
      const token = localStorage.getItem('token');
      alert(appointment.pet_id.id)
      const response = await fetch(`http://localhost:3000/fichas?pet_id=${appointment.pet_id.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const ficha = data[0]; 

      if (ficha) {
        setAppliedVaccines(ficha.vacunas);  
        setVaccines(ficha.vacunas);         
        setAllergies(ficha.alergias);       
        setDiseases(ficha.enfermedades);    
      }
    };

    fetchVets();
    fetchVaccinationRecord();
  }, [appointment.pet_id.id]);

  const handleSaveVaccination = async () => {
    const token = localStorage.getItem('token');
    const newFichaData = {
      pet_id: appointment.pet_id.id,
      cita_id: appointment.id,
      vacunas: vaccines,
      enfermedades: diseases,
      alergias: allergies,
    };

    try {
      // Crear una nueva ficha de vacunación
      const responseFicha = await fetch('http://localhost:3000/fichas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFichaData),
      });

      if (!responseFicha.ok) {
        throw new Error('Error al guardar la ficha de vacunación');
      }

      // Actualizar el estado de la cita asociada
      const responseCita = await fetch(`http://localhost:3000/citas/${appointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: false }), // Cambia el estado de la cita a false
      });

      if (!responseCita.ok) {
        const errorData = await responseCita.json(); // Capturar el mensaje de error si el backend lo envía
        console.error('Error al actualizar el estado de la cita:', errorData);
        throw new Error('Error al actualizar el estado de la cita');
      }

      onUpdateAppointments();

      onClose();
    } catch (error) {
      console.error('Error en el proceso de guardado:', error);
    }
  };


  const handleEditAppointment = () => {
    const updatedAppointmentData = {
      ...appointment,
      time,
      vet_id: vetId,
      observations: observation,
    };
    
    onEditAppointment(updatedAppointmentData); 
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
              <label className="block mb-1">Vacunas2</label>
              <div>
                {['Distemper', 'Parvovirosis', 'Rabia', 'Adenovirus', 'Leptospirosis'].map((vaccine) => (
                  <label key={vaccine} className="block">
                    <input
                      type="checkbox"
                      checked={vaccines.includes(vaccine)}
                      disabled={appliedVaccines.includes(vaccine)} 
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
        <div className="flex justify-end w-full mt-4">
          <button onClick={onClose} className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
            Cancelar
          </button>
          <button onClick={handleEditAppointment} className="mr-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700">
            Editar Cita
          </button>
          <button onClick={handleSaveVaccination} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Guardar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditAppointmentModal;
