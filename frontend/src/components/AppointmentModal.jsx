import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getClients, createClients } from "../services/clientsService.js";
import { createAppointment, updateAppointment } from "../services/appointmentService";
import Modal from "./Modal.jsx";

const formatDateForInput = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const AppointmentModal = ({ selectedDate, appointment = null, onClose, onCreated }) => {
    const { t } = useTranslation();

    const isEditing = Boolean(appointment);
    const [clients, setClients] = useState([]);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", phone: "" });

    const [formData, setFormData] = useState({
        client_id: appointment ? String(appointment.client_id) : "",
        date: appointment
            ? appointment.start_time.slice(0, 10)
            : formatDateForInput(selectedDate),
        start_time: appointment
            ? appointment.start_time.slice(11, 16)
            : "",
        end_time: appointment
            ? appointment.end_time.slice(11, 16)
            : "",
        notes: appointment?.notes ?? "",
        expected_amount: appointment?.expected_amount ?? 0,
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                setClients(data);
            } catch (error) {
                console.error("Error al obtener clientes:", error);
            }
        };

        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.end_time <= formData.start_time) {
            alert(t("invalidTimeRange"));
            return;
        }

        const appointmentData = {
            client_id: Number(formData.client_id),
            start_time: `${formData.date}T${formData.start_time}:00`,
            end_time: `${formData.date}T${formData.end_time}:00`,
            notes: formData.notes,
            expected_amount: Number(formData.expected_amount)
        };

        try {
            setIsWaitingForResponse(true);

            if (isEditing) {
                await updateAppointment(appointment.id, appointmentData);
            } else {
                await createAppointment(appointmentData);
            }

            onCreated();
        } catch (error) {
            console.error("Error al crear el turno", error);
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    const handleClientChange = (e) => {
        const { name, value } = e.target;

        setNewClient((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateClient = async () => {
        if (!newClient.name.trim() || !newClient.phone.trim()) {
            alert(t("requiredClientFields"));
            return;
        }

        try {
            setIsWaitingForResponse(true);

            const createdClient = await createClients(newClient);

            setClients((prev) => [...prev, createdClient]);

            setFormData((prev) => ({
                ...prev,
                client_id: String(createdClient.id),
            }));

            setIsCreatingClient(false);
            setNewClient({ name: "", phone: "" });
        } catch (error) {
            console.error("Error al crear el cliente:", error);
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    return (
        <Modal
            title={isEditing ? t("editAppointment") : t("newAppointment")}
            onClose={onClose}
            disabled={isWaitingForResponse}
        >
            <form
                className="appointment-modal"
                onSubmit={handleSubmit}
            >
                <div className="appointment-modal__field">
                    <label htmlFor="client_id">{t("client")}</label>

                    <div className="client_and_button">
                        <select
                            id="client_id"
                            name="client_id"
                            value={formData.client_id}
                            onChange={handleChange}
                            required
                            disabled={isWaitingForResponse}
                        >
                            <option value="">{t("selectClient")}</option>

                            {clients
                                .filter((client) => client.is_active)
                                .map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                        </select>

                        <button
                            className="appointment-modal__submit"
                            type="button"
                            onClick={() => setIsCreatingClient((prev) => !prev)}
                        >
                            {isCreatingClient ? t("cancel") : "+"}
                        </button>
                    </div>

                    {isCreatingClient && (
                        <div className="appointment-modal__new-client">
                            <div className="appointment-modal__field">
                                <label htmlFor="client_name">{t("name")}</label>
                                <input
                                    type="text"
                                    id="client_name"
                                    name="name"
                                    value={newClient.name}
                                    onChange={handleClientChange}
                                />
                            </div>

                            <div className="appointment-modal__field">
                                <label htmlFor="client_phone">{t("phone")}</label>
                                <input
                                    type="tel"
                                    id="client_phone"
                                    name="phone"
                                    value={newClient.phone}
                                    onChange={handleClientChange}
                                />
                            </div>

                            <button
                                type="button"
                                className="appointment-modal__submit"
                                onClick={handleCreateClient}
                            >
                                {t("saveClient")}
                            </button>
                        </div>
                    )}
                </div>

                <div className="appointment-modal__field">
                    <label htmlFor="date">{t("appointmentDate")}</label>
                    <input
                        id="date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        disabled={isWaitingForResponse}
                    />
                </div>

                <div className="appointment-modal__hours">
                    <div className="appointment-modal__field">
                        <label htmlFor="start_time">{t("from")}</label>
                        <input
                            type="time"
                            id="start_time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                            disabled={isWaitingForResponse}
                        />
                    </div>

                    <div className="appointment-modal__field">
                        <label htmlFor="end_time">{t("to")}</label>
                        <input
                            type="time"
                            id="end_time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                            disabled={isWaitingForResponse}
                        />
                    </div>
                </div>

                <div className="appointment-modal__field">
                    <label htmlFor="notes">{t("notes")}</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={isWaitingForResponse}
                    />
                </div>

                <div className="appointment-modal__field">
                    <label htmlFor="expected_amount">{t("amount")}</label>
                    <input
                        id="expected_amount"
                        type="number"
                        min={0}
                        step={0.01}
                        name="expected_amount"
                        value={formData.expected_amount}
                        onChange={handleChange}
                        disabled={isWaitingForResponse}
                    />
                </div>

                <button
                    className="appointment-modal__submit"
                    type="submit"
                    disabled={isWaitingForResponse}
                >
                    {isWaitingForResponse
                        ? t("saving")
                        : isEditing
                            ? t("saveChanges")
                            : t("saveAppointment")}
                </button>
            </form>
        </Modal>
    );
};

export default AppointmentModal;