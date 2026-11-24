import { useTranslation } from "react-i18next";
import { deleteAppointment, updateAppointmentPayment, updateAppointmentStatus } from "../services/appointmentService.js";
import { formatoReales } from "../utils/currencyUtils.js";

const AppointmentItem = ({ appointment, onStatusChanged, onEditAppointment, isMenuOpen, setIsMenuOpen }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "pt-BR" ? "pt-BR" : "es-AR";

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

        const confirmed = window.confirm(t("confirmDeleteAppointment"));

        if (!confirmed) return;

        try {
            await deleteAppointment(appointment.id);
            setIsMenuOpen(false);
            onStatusChanged();
        } catch (error) {
            console.error("Error al eliminar el turno:", error);
        }
    };

    const handlePaymentComplete = async (appointmentData, method) => {
        try {
            await updateAppointmentPayment(appointmentData.id, {
                received_amount: method === null ? 0 : appointmentData.expected_amount,
                payment_method: method
            });

            setIsMenuOpen(false);
            onStatusChanged();

        } catch (error) {
            console.error(error);
        }
    };

    const handleWhatsAppReminder = () => {
        const phone = appointment.phone.replace(/\D/g, "");

        const date = new Date(appointment.start_time);

        const formattedDate = date.toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const time = appointment.start_time.slice(11, 16);

        const message = t("whatsappReminder", {
            name: appointment.name,
            date: formattedDate,
            time: time
        });

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
        setIsMenuOpen(false);
    };

    return (
        <div className={`appointment-item is-${appointment.status}`}>
            <div className="appointment-item__header">
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
                        aria-label={t("appointmentOptions")}
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
                                {t("edit")}
                            </button>

                            {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange("completed")}
                                >
                                    {t("complete")}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleWhatsAppReminder}
                            >
                                {t("sendReminder")}
                            </button>

                            <hr />

                            {Number(appointment.received_amount) < Number(appointment.expected_amount) && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handlePaymentComplete(appointment, "pix")}
                                    >
                                        {t("chargePix")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handlePaymentComplete(appointment, "cash")}
                                    >
                                        {t("chargeCash")}
                                    </button>
                                </>
                            )}

                            {Number(appointment.received_amount) > 0 && (
                                <button
                                    type="button"
                                    onClick={() => handlePaymentComplete(appointment, null)}
                                >
                                    {t("reversePayment")}
                                </button>
                            )}

                            <hr />

                            {appointment.status !== "cancelled" && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange("cancelled")}
                                >
                                    {t("cancel")}
                                </button>
                            )}

                            {appointment.status !== "scheduled" && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange("scheduled")}
                                >
                                    {t("markAsPending")}
                                </button>
                            )}

                            <button
                                className="danger"
                                type="button"
                                onClick={handleDelete}
                            >
                                {t("delete")}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="appointment-item__payment">
                <div className="appointment-item__amount">
                    <span>{t("expected")}</span>
                    <strong>
                        {formatoReales.format(appointment.expected_amount ?? 0)}
                    </strong>
                </div>

                <div className="appointment-item__amount is-received">
                    <span>{t("received")}</span>
                    <strong>
                        {formatoReales.format(appointment.received_amount ?? 0)}
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default AppointmentItem;