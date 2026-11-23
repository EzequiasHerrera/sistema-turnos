import { useState } from "react";
import { getCalendarDays } from "../utils/calendarUtils.js"
import { isSameDate } from "../utils/dateUtils.js";

const Calendar = ({ selectedDate, onSelectedDate, appointments, setEditingAppointment, setIsAppointmentModalOpen }) => {
    const [currentDate, setCurrentDate] = useState(() => new Date());

    const calendarDays = getCalendarDays(currentDate);
    const monthTitle = currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
    const formattedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

    const hasAppointments = (date) => {
        return appointments.some((appointment) => {
            const appointmentDate = new Date(appointment.start_time);

            return isSameDate(date, appointmentDate);
        });
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
    }

    return (
        <section className="calendar-panel" aria-label="Calendario mensual">
            <header className="calendar-header">
                <h1 className="calendar-month">{formattedMonthTitle}</h1>
                <section className="calendar-navigation">
                    <button className="month-nav-button previous" onClick={() => changeMonth(-1)}>{'<'}</button>
                    <button className="month-nav-button next" onClick={() => changeMonth(1)}>{'>'}</button>
                </section>
            </header>

            <div className="calendar-placeholder">
                <div className="calendar-weekdays">
                    {["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"].map((weekDay) => (
                        <span key={weekDay}>{weekDay}</span>
                    ))}
                </div>
                <div className="calendar-days">
                    {calendarDays.map((day) => (
                        <button
                            key={day.date.toISOString()}
                            onClick={() => onSelectedDate(day.date)}
                            type="button"
                            className={
                                `calendar-day ${!day.isCurrentMonth ? "outside-month" : ""} ${isSameDate(day.date, selectedDate) ? "is-selected" : ""} ${isSameDate(day.date, new Date()) ? "is-today" : ""}
                                `}>
                            {day.date.getDate()}

                            {hasAppointments(day.date) && (
                                <span className="appointment-dot" aria-hidden="true" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
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
        </section>
    )
}

export default Calendar