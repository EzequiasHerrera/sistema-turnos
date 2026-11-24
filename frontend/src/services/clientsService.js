import { API_URL } from "../config/api.js";

// GET ALL CLIENTS
export const getClients = async () => {
    const response = await fetch(`${API_URL}clients`);

    if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.status}`);
    }

    return response.json();
};

// CREATE CLIENT
export const createClients = async (clientData) => {
    const response = await fetch(`${API_URL}clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
    });

    if (!response.ok) {
        throw new Error("No se pudo crear el cliente");
    }

    return response.json();
};

// DELETE CLIENT
export const deleteClient = async (id) => {
    const response = await fetch(`${API_URL}clients/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar el cliente");
    }

    return response.json();
};

// UPDATE CLIENT
export const updateClient = async (id, clientData) => {
    const response = await fetch(`${API_URL}clients/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
    });

    if (!response.ok) {
        throw new Error("No se pudo actualizar el cliente");
    }

    return response.json();
};