import { useEffect, useState } from 'react';
import Calendar from './components/Calendar.jsx';
import AppointmentPanel from './components/AppointmentPanel.jsx';
import { getAppointments } from './services/appointmentService.js';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setError(false); setLoading(true);

        const appointments = await getAppointments();
        setAppointments(appointments);
      } catch (error) {
        setError(true);
        console.error("Error al obtener los turnos", error);
      } finally {
        setLoading(false);

      }
    }

    fetchAppointments();
  }, []);

  const dailyAppointments = appointments.filter((appointment) => {
    if (!selectedDate) return true;

    const appointmentDate = new Date(appointment.start_time);

    return (selectedDate.getFullYear() === appointmentDate.getFullYear() &&
      selectedDate.getMonth() === appointmentDate.getMonth() &&
      selectedDate.getDate() === appointmentDate.getDate());
  });

  return (
    <main className="app">
      <nav className="main-navigation" aria-label="Navegación principal">
        <button
          type="button"
          className="nav-button is-active"
          aria-current="page"
        >
          Calendario
        </button>

        <button type="button" className="nav-button">
          Clientes
        </button>
      </nav>

      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} appointments={appointments} />

      <div className="calendar-actions">
        <button
          type="button"
          className="add-appointment"
          aria-label="Agregar turno"
        >
          +
        </button>
      </div>

      <AppointmentPanel selectedDate={selectedDate} appointments={dailyAppointments} loading={loading} error={error} />
    </main>
  )
}

export default App;