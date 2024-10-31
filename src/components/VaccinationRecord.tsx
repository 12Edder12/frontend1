import React, { useEffect, useState } from 'react';

interface VaccinationRecordProps {
  petId: number;
}

interface Ficha {
  id: number;
  vacunas: string[] | string; 
  enfermedades: string[] | string; 
  alergias: string[] | string; 
  pet_id: number;
  cita_id?: number;
}

const VaccinationRecord: React.FC<VaccinationRecordProps> = ({ petId }) => {
  const [fichas, setFichas] = useState<Ficha[]>([]);

  useEffect(() => {
    const fetchVaccinationRecord = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de autenticación.');
        }

        const response = await fetch(`http://localhost:3000/fichas?pet_id=${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Asegurar que todos los campos sean arrays
        const formattedFichas = data.map((ficha: Ficha) => ({
          ...ficha,
          vacunas: typeof ficha.vacunas === 'string' ? ficha.vacunas.split(',').map((v) => v.trim()) : ficha.vacunas,
          enfermedades: typeof ficha.enfermedades === 'string' ? ficha.enfermedades.split(',').map((e) => e.trim()) : ficha.enfermedades,
          alergias: typeof ficha.alergias === 'string' ? ficha.alergias.split(',').map((a) => a.trim()) : ficha.alergias,
        }));

        setFichas(formattedFichas);
      } catch (error) {
        console.error('Error al cargar la ficha de vacunación:', error);
      }
    };

    if (petId) {
      fetchVaccinationRecord();
    }
  }, [petId]);

  if (fichas.length === 0) {
    return <div>No se ha cargado la ficha de vacunación.</div>;
  }

  // Combinar todas las vacunas, enfermedades y alergias de todas las fichas
  const combinedVacunas = Array.from(new Set(fichas.flatMap((ficha) => ficha.vacunas)));
  const combinedEnfermedades = Array.from(new Set(fichas.flatMap((ficha) => ficha.enfermedades)));
  const combinedAlergias = Array.from(new Set(fichas.flatMap((ficha) => ficha.alergias)));

  // Eliminar el registro de "Ninguna" si ya tiene alguna enfermedad o alergia
  const filteredVacunas = combinedVacunas.filter(vacuna => vacuna !== 'Ninguna');
  const filteredEnfermedades = combinedEnfermedades.filter(enfermedad => enfermedad !== 'Ninguna');
  const filteredAlergias = combinedAlergias.filter(alergia => alergia !== 'Ninguna');



  return (
    <div className="vaccination-record bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Ficha de Vacunación para Mascota ID: {petId}</h2>

      {/* Vacunas */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Vacunas</h3>
        <ul className="bg-white p-4 rounded-lg shadow">
          {combinedVacunas.length > 0 ? (
            combinedVacunas.map((vacuna, index) => <li key={index} className="py-1">{vacuna}</li>)
          ) : (
            <li>No hay vacunas registradas.</li>
          )}
        </ul>
      </div>

      {/* Enfermedades */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Enfermedades</h3>
        <ul className="bg-white p-4 rounded-lg shadow">
          {filteredEnfermedades.length > 0 ? (
            filteredEnfermedades.map((enfermedad, index) => <li key={index} className="py-1">{enfermedad}</li>)
          ) : (
            <li>No hay enfermedades registradas.</li>
          )}
        </ul>
      </div>

      {/* Alergias */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Alergias</h3>
        <ul className="bg-white p-4 rounded-lg shadow">
          {filteredAlergias.length > 0 ? (
            filteredAlergias.map((alergia, index) => <li key={index} className="py-1">{alergia}</li>)
          ) : (
            <li>No hay alergias registradas.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VaccinationRecord;
