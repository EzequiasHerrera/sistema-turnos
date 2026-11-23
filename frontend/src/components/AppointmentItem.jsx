
import { useState } from "react";
import {
    updateAppointmentStatus,
    deleteAppointment
} from "../services/appointmentService.js";

const AppointmentItem = ({ appointment, onStatusChanged, onEditAppointment, isMenuOpen, setIsMenuOpen }) => {
    

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

    const handleWhatsAppReminder = () => {
        const phone = appointment.phone.replace(/\D/g, "");

        const date = new Date(appointment.start_time);

        const formattedDate = date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const time = appointment.start_time.slice(11, 16);

        const message = `¡Hola ${appointment.name}! Te recordamos que tenés un turno el día ${formattedDate} a las ${time} hs. ¡Te esperamos!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
        setIsMenuOpen(false);
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

                        <button
                            type="button"
                            onClick={handleWhatsAppReminder}
                        >
                            Enviar recordatorio
                        </button>

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
