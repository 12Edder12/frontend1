import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppointmentForm from './AppointmentForm'; // Importa el modal
import EditAppointmentModal from './EditAppointmentModal'; // Modal para editar citas y ficha de vacunación

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  date: string;
  time: string;
  pet_id: {
    id: number;  
    name: string;
  };
  vet_id: {
    name: string;
  };
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/citas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error al cargar citas:', error);
      }
    };
    useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSlotSelect = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };


  const handleSaveAppointment = async (appointmentData: any) => {
    const token = localStorage.getItem('token');
    try {
      console.log("Enviando datos:", appointmentData);  // Imprime los datos a enviar
      const response = await fetch('http://localhost:3000/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();  // Extraer el mensaje de error del backend
        console.error('Error del servidor:', errorData);
        throw new Error('Error al guardar la cita');
      }
  
      setShowModal(false);
      fetchAppointments(); 
      const updatedAppointments = await response.json();
      setAppointments((prev) => [...prev, updatedAppointments]);
    } catch (error) {
      console.error('Error al guardar la cita:', error);
    }
  };

  const handleEditAppointment = async (updatedAppointment: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/citas/${updatedAppointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updatedAppointment,
          pet_id: updatedAppointment.pet_id.id,
          vet_id: updatedAppointment.vet_id.id,
        }), // Solo enviar los IDs
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la cita');
      }
      fetchAppointments(); 
      const updatedAppointments = await response.json();
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointments : appointment
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };


  const handleUpdateVaccination = async (updatedVaccinationData: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/fichas/${selectedAppointment?.pet_id.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updatedVaccinationData,
          status: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la ficha de vacunación');
      }
      fetchAppointments(); 
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar la ficha de vacunación:', error);
    }
  }; 

const events = appointments.map((appointment) => {
  const start = new Date(`${appointment.date.substring(0, 10)}T${appointment.time}`);
  const end = new Date(start.getTime() + 30 * 60000); 

  return {
    title: `${appointment.pet_id?.name || 'Sin mascota'} con ${appointment.vet_id?.name || 'Sin veterinario'}`,
    start, 
    end, 
    id: appointment.id,
  };
});

const today = new Date();
  const todayString = today.toISOString().substring(0, 10); 

  const todaysAppointments = appointments.filter(
    (appointment) => appointment.date.substring(0, 10) === todayString
  );


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Citas</h2>
      
      <div className="flex">
        {/* Calendario a la izquierda */}
        <div className="w-2/3">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="day"
            style={{ height: 500 }}
            views={['week', 'day']}
            selectable
            onSelectSlot={handleSlotSelect}
            min={new Date(1970, 1, 1, 8)}  // Empieza a las 8 AM
            max={new Date(1970, 1, 1, 21)} 
          />
        </div>

        {/* Mostrar el modal para crear una cita */}
      {showModal && selectedDate && (
        <AppointmentForm
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAppointment}
        />
      )}
    


         {/* Citas del día a la derecha */}
         <div className="w-1/3 pl-4">
          <h3 className="text-xl font-semibold mb-2">Citas del Día</h3>
          <ul className="bg-white p-4 rounded-lg shadow">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((appointment) => (
                <li key={appointment.id} className="mb-2" onClick={() => handleAppointmentClick(appointment)}>
                  {appointment.pet_id?.name || 'Sin mascota'} con {appointment.vet_id?.name || 'Sin veterinario'} 
                  a las {appointment.time}
                </li>
              ))
            ) : (
              <li>No hay citas para hoy.</li>
            )}
          </ul>
        </div>
      </div>

      {showEditModal && selectedAppointment && (
         <EditAppointmentModal
         appointment={selectedAppointment}
         onClose={() => setShowEditModal(false)}
         onSave={handleUpdateVaccination} 
         onEditAppointment={handleEditAppointment}
         onUpdateAppointments={fetchAppointments} 
       />
     )}


      {/* Tabla debajo */}
      <div className="mt-8">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Mascota</th>
              <th className="py-3 px-6 text-left">Veterinario</th>
              <th className="py-3 px-6 text-left">Fecha</th>
              <th className="py-3 px-6 text-left">Hora</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{appointment.id}</td>
                <td className="py-3 px-6">{appointment.pet_id?.name || 'Sin mascota'}</td>
                <td className="py-3 px-6">{appointment.vet_id?.name || 'Sin veterinario'}</td>
                <td className="py-3 px-6">{new Date(appointment.date).toLocaleDateString()}</td>
                <td className="py-3 px-6">{appointment.time}</td>
                <td className="py-3 px-6">
                  <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition duration-200">Editar</button>
                  <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-200 ml-2">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentList;
