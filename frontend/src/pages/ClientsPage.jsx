
import { useEffect, useState } from "react";
import { deleteClient, getClients } from "../services/clientsService.js";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                setError(false);

                const data = await getClients();
                setClients(data);
            } catch (error) {
                console.error("Error al obtener clientes:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) return (
        <section className="clients-page">
            <h1>Clientes</h1>

            <div className="clients-list">
                <div className="client-item client-item--loading">
                </div>
                <div className="client-item client-item--loading">
                </div>
                <div className="client-item client-item--loading">
                </div>
            </div>
        </section>
    )

    if (error) return <p>Error al cargar los clientes.</p>;

    return (
        <section className="clients-page">
            <h1>Clientes</h1>

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
        </section>
    );
};

export default ClientsPage;
