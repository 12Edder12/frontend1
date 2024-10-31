import React, { useEffect, useState } from 'react';
import OwnerList from './ClientsList';
import PetList from './PetList';
import AppointmentList from './AppointmentList';
import UserList from './UserList'; // Este será tu CRUD de empleados
import VaccinationRecord from './VaccinationRecord'; // Ficha de vacunación
import { useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>(''); // Controla lo que se selecciona en el menú izquierdo
  const [vetOption, setVetOption] = useState<string>(''); // Controla el menú horizontal en Veterinaria
  const [userRole, setUserRole] = useState<number | null>(null); // Guardamos el rol del usuario aquí
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role); // Asignamos el rol decodificado
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Preselección de menú según el rol del usuario
    if (userRole === 1) {
      setSelectedOption('personal'); // Admin (rol 1) va a la sección de personal
    } else if (userRole === 2) {
      setSelectedOption('veterinaria'); // Asistente (rol 2) va a la sección de veterinaria
    }
  }, [userRole]);

  const handleLeftMenuClick = (option: string) => {
    setSelectedOption(option);
    setVetOption(''); // Reiniciar la opción horizontal cuando cambies de sección
  };

  const handleVetMenuClick = (option: string) => {
    setVetOption(option);
  };

  const handleSelectPet = (petId: number) => {
    setSelectedPetId(petId);
    setVetOption('vaccination'); // Mostramos la ficha de vacunación cuando se selecciona una mascota
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirigir al login
  };

  return (
    <div className="dashboard-container flex">
      {/* Menú Izquierdo */}
      <div className="left-menu bg-gray-800 text-white w-1/5 h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Menú</h2>
        <ul>
          {/* Opción Personal (solo visible para el admin) */}
          {userRole === 1 && (
            <li
              className={`cursor-pointer mb-4 ${selectedOption === 'personal' ? 'bg-gray-600' : ''}`}
              onClick={() => handleLeftMenuClick('personal')}
            >
              Personal
            </li>
          )}
          {/* Opción Veterinaria (visible para ambos roles) */}
          <li
            className={`cursor-pointer mb-4 ${selectedOption === 'veterinaria' ? 'bg-gray-600' : ''}`}
            onClick={() => handleLeftMenuClick('veterinaria')}
          >
            Veterinaria
          </li>
          <li className="mt-auto bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Menú Horizontal solo para la opción Veterinaria */}
      <div className="main-content w-4/5 p-4">
        {selectedOption === 'veterinaria' && (
          <div className="vet-menu bg-gray-100 p-4 mb-4">
            <ul className="flex justify-around">
              <li
                className={`cursor-pointer ${vetOption === 'appointments' ? 'font-bold' : ''}`}
                onClick={() => handleVetMenuClick('appointments')}
              >
                Asignación de Cita
              </li>
              <li
                className={`cursor-pointer ${vetOption === 'clients' ? 'font-bold' : ''}`}
                onClick={() => handleVetMenuClick('clients')}
              >
                Gestión de Clientes
              </li>
              <li
                className={`cursor-pointer ${vetOption === 'pets' ? 'font-bold' : ''}`}
                onClick={() => handleVetMenuClick('pets')}
              >
                Gestión de Mascotas
              </li>
            </ul>
          </div>
        )}

        {/* Contenido Dinámico según la selección */}
        <div className="content-area">
          {/* Vista de Personal (CRUD de Empleados) */}
          {selectedOption === 'personal' && userRole === 1 && <UserList />}

          {/* Vista de Veterinaria */}
          {selectedOption === 'veterinaria' && vetOption === '' && (
            <div>
              <AppointmentList /> {/* Mostrar las citas del día */}
            </div>
          )}

          {/* Asignación de Citas */}
          {vetOption === 'appointments' && <AppointmentList />}

          {/* Gestión de Clientes */}
          {vetOption === 'clients' && <OwnerList />}

          {/* Gestión de Mascotas */}
          {vetOption === 'pets' && <PetList onSelectPet={handleSelectPet}/>}

          {/* Ficha de vacunación */}
            {vetOption === 'vaccination' && selectedPetId && (
              <VaccinationRecord petId={selectedPetId} />
            )}
        
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
