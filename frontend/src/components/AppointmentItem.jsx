
import { useState } from "react";
import {
    updateAppointmentStatus,
    deleteAppointment
} from "../services/appointmentService.js";

const AppointmentItem = ({ appointment, onStatusChanged, onEditAppointment }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleStatusChange = async (newStatus) => {
        try {
            await updateAppointmentStatus(appointment.id, newStatus);
            setIsMenuOpen(false);
            onStatusChanged();
        } catch (error) {
            console.error("Error al actualizar el turno:", error);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();

        const confirmed = window.confirm(
            "¿Estás seguro de que querés eliminar este turno definitivamente?"
        );

        if (!confirmed) return;

        try {
            await deleteAppointment(appointment.id);
            setIsMenuOpen(false);
            onStatusChanged();
        } catch (error) {
            console.error("Error al eliminar el turno:", error);
        }
    };

    return (
        <div
            className={`appointment-item is-${appointment.status}`}
        >
            <div className="appointment-item__info">
                <span className="appointment-item__time">
                    {appointment.start_time.slice(11, 16)} - {appointment.end_time.slice(11, 16)}
                </span>

                <p className="appointment-item__name">
                    {appointment.name}
                </p>

                {appointment.notes && (
                    <p className="appointment-item__notes">
                        {appointment.notes}
                    </p>
                )}
            </div>

            <div
                className="appointment-menu"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="appointment-menu-btn"
                    aria-label="Opciones del turno"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ⋮
                </button>

                {isMenuOpen && (
                    <div className="appointment-menu-dropdown">
                        <button
                            type="button"
                            onClick={() => {
                                setIsMenuOpen(false);
                                onEditAppointment(appointment);
                            }}
                        >
                            Editar
                        </button>
                        {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                            <button
                                type="button"
                                onClick={() => handleStatusChange("completed")}
                            >
                                Completar
                            </button>
                        )}

                        {appointment.status !== "cancelled" && (
                            <button
                                type="button"
                                onClick={() => handleStatusChange("cancelled")}
                            >
                                Cancelar
                            </button>
                        )}

                        {appointment.status !== "scheduled" && (
                            <button
                                type="button"
                                onClick={() => handleStatusChange("scheduled")}
                            >
                                Marcar como pendiente
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleDelete}
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentItem;
