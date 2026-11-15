import { API_URL } from "../config/api.js";

export const getClients = async () => {
    const response = await fetch(`${API_URL}/api/clients`);

    if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.status}`);
    }

    return response.json();
};