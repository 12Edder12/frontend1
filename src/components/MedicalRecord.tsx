import React, { useState, useEffect } from 'react';

interface MedicalRecord {
  id: number;
  petName: string;
  description: string;
  date: string;
}

const MedicalRecordList: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/medical-records')
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(error => console.error('Error al cargar fichas médicas:', error));
  }, []);

  return (
    <div className="medical-record-list">
      <h2>Fichas Médicas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mascota</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.petName}</td>
              <td>{record.description}</td>
              <td>{record.date}</td>
              <td>
                <button className="edit-btn">Editar</button>
                <button className="delete-btn">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalRecordList;
