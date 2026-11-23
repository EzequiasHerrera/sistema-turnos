import { useEffect, useState } from "react";
import Calendar from "../components/Calendar.jsx";
import AppointmentPanel from "../components/AppointmentPanel.jsx";
import { getAppointments } from "../services/appointmentService.js";
import AppointmentModal from "../components/AppointmentModal.jsx";
import { isSameDate } from "../utils/dateUtils.js";

const CalendarPage = () => {
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [panelState, setPanelState] = useState("closed");

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

    const handleSetSelectedDate = (clickedDate) => {
        if (isSameDate(clickedDate, selectedDate)) {
            setPanelState("half");
        } else {
            setSelectedDate(clickedDate);
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
                onSelectedDate={handleSetSelectedDate}
                appointments={appointments}
                setEditingAppointment={setEditingAppointment}
                setIsAppointmentModalOpen={setIsAppointmentModalOpen}

            />

            <AppointmentPanel
                selectedDate={selectedDate}
                appointments={dailyAppointments}
                loading={loading}
                error={error}
                onStatusChanged={fetchAppointments}
                panelState={panelState}
                setPanelState={setPanelState}
                onEditAppointment={(appointment) => {
                    setEditingAppointment(appointment);
                    setIsAppointmentModalOpen(true);
                }}
            />
        </>
    )
}

export default CalendarPage