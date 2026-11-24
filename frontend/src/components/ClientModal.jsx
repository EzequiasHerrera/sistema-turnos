import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createClients, updateClient } from "../services/clientsService.js";
import Modal from "./Modal.jsx";

const ClientModal = ({ client = null, onClose, onCreated }) => {
    const { t } = useTranslation();

    const isEditing = Boolean(client);

    const [formData, setFormData] = useState({
        name: client?.name ?? "",
        phone: client?.phone ?? "",
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim()) {
            alert(t("requiredClientFields"));
            return;
        }

        try {
            setIsSaving(true);

            if (isEditing) {
                await updateClient(client.id, formData);
            } else {
                await createClients(formData);
            }

            onCreated();
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            alert(t("saveClientError"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            title={isEditing ? t("editClient") : t("createClient")}
            onClose={onClose}
            disabled={isSaving}
        >
            <form className="client-modal" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="client_name">{t("name")}</label>

                    <input
                        id="client_name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSaving}
                        required
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="client_phone">{t("phone")}</label>

                    <input
                        id="client_phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSaving}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="modal-submit"
                    disabled={isSaving}
                >
                    {isSaving
                        ? t("saving")
                        : isEditing
                            ? t("saveChanges")
                            : t("saveClient")}
                </button>
            </form>
        </Modal>
    );
};

export default ClientModal;