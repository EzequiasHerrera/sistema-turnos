import { useEffect, useState } from "react"
import { getAppointments } from "../services/appointmentService.js";
import { formatoReales } from "../utils/currencyUtils.js";
import { isSameDate } from "../utils/dateUtils.js";

const FinancesPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [period, setPeriod] = useState("month");

    const today = new Date();

    const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.start_time);

        if (period === "day") {
            return isSameDate(appointmentDate, today);
        }

        if (period === "month") {
            return (
                appointmentDate.getMonth() === today.getMonth() &&
                appointmentDate.getFullYear() === today.getFullYear()
            );
        }

        if (period === "week") {
            const monday = new Date(today);
            monday.setDate(today.getDate() - (today.getDay() + 6) % 7);
            monday.setHours(0, 0, 0, 0);

            const nextMonday = new Date(monday);
            nextMonday.setDate(monday.getDate() + 7);

            return appointmentDate >= monday && appointmentDate < nextMonday;
        }

        return true;
    });

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

    const totalExpected = filteredAppointments
        .filter(appointment => appointment.status !== "cancelled")
        .reduce((acc, appointment) => {
            return acc + Number(appointment.expected_amount ?? 0);
        }, 0);

    const totalReceived = filteredAppointments.reduce((acc, appointment) => {
        return acc + Number(appointment.received_amount ?? 0);
    }, 0);

    const totalReceivedOnPix = filteredAppointments
        .filter(appointment => appointment.payment_method === "pix")
        .reduce((acc, appointment) => {
            return acc + Number(appointment.received_amount ?? 0);
        }, 0);

    const totalReceivedOnCash = filteredAppointments
        .filter(appointment => appointment.payment_method === "cash")
        .reduce((acc, appointment) => {
            return acc + Number(appointment.received_amount ?? 0);
        }, 0);

    const totalPending = filteredAppointments
        .filter(appointment => appointment.status !== "cancelled")
        .reduce((acc, appointment) => {
            const expected = Number(appointment.expected_amount ?? 0);
            const received = Number(appointment.received_amount ?? 0);

            return acc + Math.max(0, expected - received);
        }, 0);

    const totalAppointments = filteredAppointments.length;

    const completedAppointments = filteredAppointments
        .filter(appointment => appointment.status === "completed").length;

    const cancelledAppointments = filteredAppointments
        .filter(appointment => appointment.status === "cancelled").length;

    const scheduledAppointments = filteredAppointments
        .filter(appointment => appointment.status === "scheduled").length;

    const pixPercentage = totalReceived > 0
        ? (totalReceivedOnPix / totalReceived) * 100
        : 0;

    const cashPercentage = totalReceived > 0
        ? (totalReceivedOnCash / totalReceived) * 100
        : 0;

    const paidAppointments = filteredAppointments
        .filter(appointment => Number(appointment.received_amount) > 0)
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

    useEffect(() => {
        fetchAppointments();
    }, [])

    return (
        <section className="finances-page">
            <header className="finances-page__header">
                <h1>Finanzas</h1>

                <div className="finances-period">
                    <button
                        className={period === "day" ? "active" : ""}
                        onClick={() => setPeriod("day")}
                    >Hoy</button>

                    <button
                        className={period === "week" ? "active" : ""}
                        onClick={() => setPeriod("week")}
                    >Semana</button>

                    <button
                        className={period === "month" ? "active" : ""}
                        onClick={() => setPeriod("month")}
                    >Mes</button>
                </div>
            </header>

            {loading ? (
                <p>Cargando finanzas...</p>
            ) : error ? (
                <p>No se pudieron obtener los datos.</p>
            ) : (
                <>
                    <div className="finances-summary">
                        <article className="finance-card received">
                            <span>Total recibido</span>
                            <strong>{formatoReales.format(totalReceived)}</strong>
                        </article>

                        <article className="finance-card">
                            <span>Total esperado</span>
                            <strong>{formatoReales.format(totalExpected)}</strong>
                        </article>

                        <article className="finance-card pending">
                            <span>Pendiente de cobro</span>
                            <strong>{formatoReales.format(totalPending)}</strong>
                        </article>
                    </div>

                    <article className="finance-card">
                        <h2>Métodos de pago</h2>

                        <div className="payment-bar">
                            <div
                                className="payment-bar__pix"
                                style={{ width: `${pixPercentage}%` }}
                            />
                            <div
                                className="payment-bar__cash"
                                style={{ width: `${cashPercentage}%` }}
                            />
                        </div>

                        <div className="payment-details">
                            <div>
                                <span className="pix-label">PIX</span>
                                <strong>{formatoReales.format(totalReceivedOnPix)}</strong>
                                <small>{pixPercentage.toFixed(1)}%</small>
                            </div>

                            <div>
                                <span className="cash-label">Efectivo</span>
                                <strong>{formatoReales.format(totalReceivedOnCash)}</strong>
                                <small>{cashPercentage.toFixed(1)}%</small>
                            </div>
                        </div>
                    </article>

                    <article className="finance-card">
                        <h2>Estadísticas de turnos</h2>

                        <div className="finances-stats">
                            <div>
                                <strong>{totalAppointments}</strong>
                                <span>Totales</span>
                            </div>
                            <div>
                                <strong>{completedAppointments}</strong>
                                <span>Completados</span>
                            </div>
                            <div>
                                <strong>{scheduledAppointments}</strong>
                                <span>Pendientes</span>
                            </div>
                            <div>
                                <strong>{cancelledAppointments}</strong>
                                <span>Cancelados</span>
                            </div>
                        </div>
                    </article>

                    <article className="finance-card">
                        <h2>Detalle de cobros</h2>

                        {paidAppointments.length === 0 ? (
                            <p className="finances-empty">
                                No hay cobros en este período.
                            </p>
                        ) : (
                            <div className="finances-history">
                                {paidAppointments.map(appointment => (
                                    <div
                                        className="finance-transaction"
                                        key={appointment.id}
                                    >
                                        <div>
                                            <strong>{appointment.name}</strong>
                                            <small>
                                                {new Date(appointment.start_time)
                                                    .toLocaleDateString("es-AR")}
                                            </small>
                                        </div>

                                        <div>
                                            <strong>
                                                {formatoReales.format(appointment.received_amount)}
                                            </strong>
                                            <small>
                                                {appointment.payment_method === "pix"
                                                    ? "PIX"
                                                    : "Efectivo"}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                </>
            )}
        </section>
    );
}

export default FinancesPage