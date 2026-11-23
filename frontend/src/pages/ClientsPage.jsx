
import { useEffect, useState } from "react";
import { deleteClient, getClients } from "../services/clientsService.js";
import ClientModal from "../components/ClientModal.jsx";
import ClientAppointmentsModal from "../components/ClientAppointmentsModal.jsx";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    const [selectedClient, setSelectedClient] = useState(null);

    const handleDeleteClient = async (id) => {
        if (!window.confirm("¿Eliminar este cliente definitivamente?")) return;

        try {
            await deleteClient(id);
            setClients((prev) => prev.filter((client) => client.id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el cliente. Puede tener turnos asociados.");
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

    if (error) return <p>Error al cargar los clientes.</p>;

    return (
        loading ?
            (<section className="clients-page">
                <div className="clients-page__header">
                    <h1>Clientes</h1>
                    <button
                        type="button"
                        className="add-appointment"
                        disabled={true}
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
                        onClose={() => setIsClientModalOpen(false)}
                        onCreated={() => {
                            setIsClientModalOpen(false);
                            fetchClients(false);
                        }}
                    />
                )}

                <div className="clients-page__header">
                    <h1>Clientes</h1>
                    <button
                        type="button"
                        className="add-appointment"
                        aria-label="Agregar cliente"
                        onClick={() => { setIsClientModalOpen(true); }}
                    >
                        +
                    </button>
                </div>

                {clients.length === 0 ? (
                    <p>No hay clientes registrados.</p>
                ) : (
                    <div className="clients-list">
                        {clients.map((client) => (
                            <div className="client-item" key={client.id}>
                                <h2>{client.name}</h2>
                                <p>{client.phone}</p>
                                <span>
                                    {client.is_active ? "Activo" : "Inactivo"}
                                </span>
                                <button type="button"
                                    onClick={() => setSelectedClient(client)}
                                >
                                    Ver Turnos
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteClient(client.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>)
    );
};

export default ClientsPage;
