import { updateAppointmentStatus } from "../services/appointmentService.js";

const AppointmentItem = ({ appointment, onStatusChanged}) => {
    const handleClick = async () => {
        const nextStatus = {
            scheduled: "completed",
            completed: "cancelled",
            cancelled: "scheduled",
        };

        try {
            await updateAppointmentStatus(
                appointment.id,
                nextStatus[appointment.status]
            );

            onStatusChanged();
        } catch (error) {
            console.error("Error al actualizar el turno:", error);
        }
    };

    return (
        <div className={`appointment-item is-${appointment.status}`}
            onClick={handleClick}>
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
        </div>
    );
};

export default AppointmentItem;