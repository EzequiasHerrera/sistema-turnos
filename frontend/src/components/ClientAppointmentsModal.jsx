import Modal from "./Modal.jsx";
import { getAppointmentsByClientId } from "../services/appointmentService.js";
import { useEffect, useState } from "react";

const ClientAppointmentsModal = ({ client, onClose }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointmentsByClientId(client.id);
                setAppointments(data);
            } catch (error) {
                console.error("Error al obtener turnos:", error);
            }
        };

        fetchAppointments();
    }, [client.id]);

    return (
        <Modal title={`Turnos de ${client.name}`} onClose={onClose}>
            {appointments.length === 0 ? (
                <p>Este cliente no tiene turnos registrados.</p>
            ) : (
                <div className="client-appointments-list">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className={`appointment-item is-${appointment.status}`}
                        >
                            <div className="appointment-item__info">
                                <span className="appointment-item__date">
                                    {new Date(appointment.start_time).toLocaleDateString("es-AR", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>

                                <span className="appointment-item__time">
                                    {appointment.start_time.slice(11, 16)} - {appointment.end_time.slice(11, 16)}
                                </span>

                                {appointment.notes && (
                                    <p className="appointment-item__notes">
                                        {appointment.notes}
                                    </p>
                                )}
                            </div>

                            <span className={`appointment-status is-${appointment.status}`}>
                                {appointment.status === "scheduled"
                                    ? "Pendiente"
                                    : appointment.status === "completed"
                                        ? "Completado"
                                        : appointment.status === "cancelled"
                                            ? "Cancelado"
                                            : appointment.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    )
}

export default ClientAppointmentsModal