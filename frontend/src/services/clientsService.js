export const getClients = async () => {
    const response = await fetch(
        "https://sistema-turnos-seven.vercel.app/api/clients"
    );

    if (!response.ok) {
        throw new Error("No se pudieron obtener los clientes");
    }

    const clients = await response.json();

    return clients;
};