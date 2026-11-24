import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCalendarDays } from "../utils/calendarUtils.js";
import { isSameDate } from "../utils/dateUtils.js";

const Calendar = ({ selectedDate, onSelectedDate, appointments, setEditingAppointment, setIsAppointmentModalOpen }) => {
    const { t, i18n } = useTranslation();

    const [currentDate, setCurrentDate] = useState(() => new Date());

    const locale = i18n.resolvedLanguage === "pt-BR" ? "pt-BR" : "es-AR";

    const calendarDays = getCalendarDays(currentDate);

    const monthTitle = currentDate.toLocaleDateString(locale, {
        month: "long",
        year: "numeric"
    });

    const formattedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

    const hasAppointments = (date) => {
        return appointments.some((appointment) => {
            const appointmentDate = new Date(appointment.start_time);

            return isSameDate(date, appointmentDate);
        });
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    return (
        <section className="calendar-panel" aria-label={t("monthlyCalendar")}>
            <header className="calendar-header">
                <h1 className="calendar-month">{formattedMonthTitle}</h1>

                <section className="calendar-navigation">
                    <button
                        className="month-nav-button previous"
                        aria-label={t("previousMonth")}
                        onClick={() => changeMonth(-1)}
                    >
                        {'<'}
                    </button>

                    <button
                        className="month-nav-button next"
                        aria-label={t("nextMonth")}
                        onClick={() => changeMonth(1)}
                    >
                        {'>'}
                    </button>
                </section>
            </header>

            <div className="calendar-placeholder">
                <div className="calendar-weekdays">
                    {t("weekdays", { returnObjects: true }).map((weekDay) => (
                        <span key={weekDay}>{weekDay}</span>
                    ))}
                </div>

                <div className="calendar-days">
                    {calendarDays.map((day) => (
                        <button
                            key={day.date.toISOString()}
                            onClick={() => {
                                if (!day.isCurrentMonth) {
                                    setCurrentDate(new Date(
                                        day.date.getFullYear(),
                                        day.date.getMonth(),
                                        1
                                    ));
                                }

                                onSelectedDate(day.date);
                            }}
                            type="button"
                            className={`calendar-day
                                ${!day.isCurrentMonth ? "outside-month" : ""}
                                ${isSameDate(day.date, selectedDate) ? "is-selected" : ""}
                                ${isSameDate(day.date, new Date()) ? "is-today" : ""}
                            `}
                        >
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
                    aria-label={t("addAppointment")}
                    onClick={() => {
                        setEditingAppointment(null);
                        setIsAppointmentModalOpen(true);
                    }}
                >
                    +
                </button>
            </div>
        </section>
    );
};

export default Calendar;