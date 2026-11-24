import { useState } from "react";
import { createClients, updateClient } from "../services/clientsService.js";
import Modal from "./Modal.jsx";

const ClientModal = ({ client = null, onClose, onCreated }) => {
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
            alert("Nombre y teléfono son obligatorios.");
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
            alert("No se pudo guardar el cliente.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            title={isEditing ? "Editar cliente" : "Crear cliente"}
            onClose={onClose}
            disabled={isSaving}
        >
            <form className="client-modal" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="client_name">Nombre</label>
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
                    <label htmlFor="client_phone">Teléfono</label>
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
                        ? "Guardando..."
                        : isEditing
                            ? "Guardar cambios"
                            : "Guardar cliente"}
                </button>
            </form>
        </Modal>
    );
};

export default ClientModal;