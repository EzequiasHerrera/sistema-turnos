import { useEffect, useState } from "react";
import Calendar from "../components/Calendar.jsx";
import AppointmentPanel from "../components/AppointmentPanel.jsx";
import { getAppointments } from "../services/appointmentService.js";
import AppointmentModal from "../components/AppointmentModal.jsx";

const CalendarPage = () => {

    const [selectedDate, setSelectedDate] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    const fetchAppointments = async () => {
        try {
            setError(false);
            setLoading(true);

            const appointments = await getAppointments();
            setAppointments(appointments);
        } catch (error) {
            setError(true);
            console.error("Error al obtener los turnos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const dailyAppointments = appointments.filter((appointment) => {
        if (!selectedDate) return true;

        const appointmentDate = new Date(appointment.start_time);

        return (
            selectedDate.getFullYear() === appointmentDate.getFullYear() &&
            selectedDate.getMonth() === appointmentDate.getMonth() &&
            selectedDate.getDate() === appointmentDate.getDate()
        );
    });

    return (
        <>
            {isAppointmentModalOpen && (
                <AppointmentModal
                    selectedDate={selectedDate}
                    appointment={editingAppointment}
                    onClose={() => {
                        setIsAppointmentModalOpen(false);
                        setEditingAppointment(null);
                    }}
                    onCreated={() => {
                        fetchAppointments();
                        setIsAppointmentModalOpen(false);
                        setEditingAppointment(null);
                    }}
                />
            )}

            <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                appointments={appointments}

            />

            <div className="calendar-actions">
                <button
                    type="button"
                    className="add-appointment"
                    aria-label="Agregar turno"
                    onClick={() => {
                        setEditingAppointment(null);
                        setIsAppointmentModalOpen(true);
                    }}
                >
                    +
                </button>
            </div>

            <AppointmentPanel
                selectedDate={selectedDate}
                appointments={dailyAppointments}
                loading={loading}
                error={error}
                onStatusChanged={fetchAppointments}
                onEditAppointment={(appointment) => {
                    setEditingAppointment(appointment);
                    setIsAppointmentModalOpen(true);
                }}
            />
        </>
    )
}

export default CalendarPage