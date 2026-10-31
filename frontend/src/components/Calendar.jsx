import { useState } from "react";
import { getCalendarDays } from "../utils/calendarUtils.js"

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
    const [selectedDate, setSelectedDate] = useState(null);

    const calendarDays = getCalendarDays(currentDate);

    const monthTitle = currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
    const formattedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

    const isSameDate = (firstDate, secondDate) =>
        firstDate?.getTime() === secondDate?.getTime()


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
                    {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map((weekDay) => (
                        <span key={weekDay}>{weekDay}</span>
                    ))}
                </div>
                <div className="calendar-days">
                    {calendarDays.map((day) => (
                        <button
                            key={day.date.toISOString()}
                            onClick={() => {
                                setSelectedDate(day.date);
                                if (!day.isCurrentMonth) {
                                    setCurrentDate(day.date);
                                };
                            }}
                            type="button" className={`calendar-day ${!day.isCurrentMonth ? "outside-month" : ""} ${isSameDate(day.date, selectedDate) ? "is-selected" : ""}`}>
                            {day.date.getDate()}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Calendar