import { API_URL } from "../config/api.js";

export const getClients = async () => {
    const response = await fetch(`${API_URL}/api/clients`);

    if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.status}`);
    }

    return response.json();
};

export const createClients = async (clientData) => {
    const response = await fetch(`${API_URL}/api/clients`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(clientData),
        }
    );

    if (!response.ok) {
        throw new Error("No se pudo crear el cliente");
    }

    return response.json();
}

export const deleteClient = async (id) => {
    const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar el cliente");
    }

    return response.json();
};