import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAppointments } from "../services/appointmentService.js";
import { formatoReales } from "../utils/currencyUtils.js";
import { isSameDate } from "../utils/dateUtils.js";

const FinancesPage = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "pt-BR" ? "pt-BR" : "es-AR";

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

    const formatPercentage = (value) => {
        return new Intl.NumberFormat(locale, {
            style: "percent",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <section className="finances-page">
            <header className="finances-page__header">
                <h1>{t("finances")}</h1>

                <div className="finances-period">
                    <button
                        className={period === "day" ? "active" : ""}
                        onClick={() => setPeriod("day")}
                    >
                        {t("today")}
                    </button>

                    <button
                        className={period === "week" ? "active" : ""}
                        onClick={() => setPeriod("week")}
                    >
                        {t("week")}
                    </button>

                    <button
                        className={period === "month" ? "active" : ""}
                        onClick={() => setPeriod("month")}
                    >
                        {t("month")}
                    </button>
                </div>
            </header>

            {loading ? (
                <p>{t("loadingFinances")}</p>
            ) : error ? (
                <p>{t("financesError")}</p>
            ) : (
                <>
                    <div className="finances-summary">
                        <article className="finance-card received">
                            <span>{t("totalReceived")}</span>
                            <strong>{formatoReales.format(totalReceived)}</strong>
                        </article>

                        <article className="finance-card">
                            <span>{t("totalExpected")}</span>
                            <strong>{formatoReales.format(totalExpected)}</strong>
                        </article>

                        <article className="finance-card pending">
                            <span>{t("pendingPayment")}</span>
                            <strong>{formatoReales.format(totalPending)}</strong>
                        </article>
                    </div>

                    <article className="finance-card">
                        <h2>{t("paymentMethods")}</h2>

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
                                <small>{formatPercentage(pixPercentage)}</small>
                            </div>

                            <div>
                                <span className="cash-label">{t("cash")}</span>
                                <strong>{formatoReales.format(totalReceivedOnCash)}</strong>
                                <small>{formatPercentage(cashPercentage)}</small>
                            </div>
                        </div>
                    </article>

                    <article className="finance-card">
                        <h2>{t("appointmentStatistics")}</h2>

                        <div className="finances-stats">
                            <div>
                                <strong>{totalAppointments}</strong>
                                <span>{t("total")}</span>
                            </div>

                            <div>
                                <strong>{completedAppointments}</strong>
                                <span>{t("completed")}</span>
                            </div>

                            <div>
                                <strong>{scheduledAppointments}</strong>
                                <span>{t("pending")}</span>
                            </div>

                            <div>
                                <strong>{cancelledAppointments}</strong>
                                <span>{t("cancelled")}</span>
                            </div>
                        </div>
                    </article>

                    <article className="finance-card">
                        <h2>{t("paymentDetails")}</h2>

                        {paidAppointments.length === 0 ? (
                            <p className="finances-empty">
                                {t("noPayments")}
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
                                                    .toLocaleDateString(locale)}
                                            </small>
                                        </div>

                                        <div>
                                            <strong>
                                                {formatoReales.format(appointment.received_amount)}
                                            </strong>
                                            <small>
                                                {appointment.payment_method === "pix"
                                                    ? "PIX"
                                                    : t("cash")}
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
};

export default FinancesPage;