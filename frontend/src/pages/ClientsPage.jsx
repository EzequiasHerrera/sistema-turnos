import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteClient, getClients } from "../services/clientsService.js";
import ClientModal from "../components/ClientModal.jsx";
import ClientAppointmentsModal from "../components/ClientAppointmentsModal.jsx";

const ClientsPage = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "pt-BR" ? "pt-BR" : "es-AR";

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedClient, setSelectedClient] = useState(null);
    const [editingClient, setEditingClient] = useState(null);

    const [searchBarInput, setSearchBarInput] = useState("");
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    const handleDeleteClient = async (id) => {
        if (!window.confirm(t("confirmDeleteClient"))) return;

        try {
            await deleteClient(id);
            setClients((prev) => prev.filter((client) => client.id !== id));
        } catch (error) {
            console.error(error);
            alert(t("deleteClientError"));
        }
    };

    const fetchClients = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(false);

            const data = await getClients();

            setClients(data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setError(true);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    if (error) return <p>{t("clientsError")}</p>;

    return (
        loading ?
            (<section className="clients-page">
                <div className="clients-page__header">
                    <h1>{t("clients")}</h1>
                    <button
                        type="button"
                        className="add-appointment"
                        disabled={true}
                        aria-label={t("addClient")}
                    >
                        +
                    </button>
                </div>

                <div className="clients-list">
                    <div className="client-item client-item--loading">
                    </div>
                    <div className="client-item client-item--loading">
                    </div>
                    <div className="client-item client-item--loading">
                    </div>
                </div>
            </section>)
            :
            (<section className="clients-page">
                {selectedClient && (
                    <ClientAppointmentsModal
                        client={selectedClient}
                        onClose={() => setSelectedClient(null)}
                    />
                )}

                {isClientModalOpen && (
                    <ClientModal
                        client={editingClient}
                        onClose={() => {
                            setIsClientModalOpen(false);
                            setEditingClient(null);
                        }}
                        onCreated={() => {
                            setIsClientModalOpen(false);
                            setEditingClient(null);
                            fetchClients(false);
                        }}
                    />
                )}

                <div className="clients-page__header">
                    <h1>{t("clients")}</h1>
                </div>

                <div className="clients-page__searchBar">
                    <input
                        type="text"
                        value={searchBarInput}
                        onChange={(e) => setSearchBarInput(e.target.value)}
                        placeholder={t("searchClient")}
                    />

                    <button
                        type="button"
                        className="create-client-button"
                        aria-label={t("addClient")}
                        onClick={() => setIsClientModalOpen(true)}
                    >
                        +
                    </button>
                </div>

                {clients.length === 0 ? (
                    <p>{t("noClients")}</p>
                ) : (
                    <div className="clients-list">
                        {[...clients]
                            .filter((client) =>
                                client.name.toLowerCase().includes(searchBarInput.toLowerCase()) ||
                                client.phone.toLowerCase().includes(searchBarInput.toLowerCase())
                            )
                            .sort((a, b) => a.name.localeCompare(b.name, locale))
                            .map((client) => (
                                <div className="client-item" key={client.id}>
                                    <div className="client-item__header">
                                        <div>
                                            <h2>{client.name}</h2>
                                            <p>{client.phone}</p>
                                        </div>

                                        <span className={client.is_active ? "active" : "inactive"}>
                                            {client.is_active
                                                ? t("active")
                                                : t("inactive")}
                                        </span>
                                    </div>

                                    <div className="client-item__actions">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            {t("viewAppointments")}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingClient(client);
                                                setIsClientModalOpen(true);
                                            }}
                                        >
                                            {t("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => handleDeleteClient(client.id)}
                                        >
                                            {t("delete")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </section>)
    );
};

export default ClientsPage;