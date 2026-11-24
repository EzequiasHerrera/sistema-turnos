import { API_URL } from "../config/api.js";

// GET ALL APPOINTMENTS
export const getAppointments = async () => {
    const response = await fetch(`${API_URL}appointments`);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los turnos");
    }

    return response.json();
};

// GET APPOINTMENTS BY CLIENT ID
export const getAppointmentsByClientId = async (clientId) => {
    const response = await fetch(
        `${API_URL}appointments/client/${clientId}`
    );

    if (!response.ok) {
        throw new Error("No se pudieron obtener los turnos del cliente");
    }

    return response.json();
};

// CREATE APPOINTMENT
export const createAppointment = async (appointmentData) => {
    const response = await fetch(`${API_URL}appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        throw new Error("No se pudo crear el turno");
    }

    return response.json();
};

// UPDATE FULL APPOINTMENT
export const updateAppointment = async (id, appointmentData) => {
    const response = await fetch(`${API_URL}appointments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        throw new Error("No se pudo actualizar el turno");
    }

    return response.json();
};

// UPDATE APPOINTMENT PAYMENT
export const updateAppointmentPayment = async (id, appointmentPaymentData) => {
    const response = await fetch(`${API_URL}appointments/${id}/payment`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentPaymentData)
    });

    if (!response.ok){
        throw new Error("No se pudo actualizar el turno"); 
    }

    return response.json();
}

// UPDATE APPOINTMENT STATUS
export const updateAppointmentStatus = async (id, status) => {
    const response = await fetch(
        `${API_URL}appointments/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        }
    );

    if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del turno");
    }

    return response.json();
};

// DELETE APPOINTMENT BY ID
export const deleteAppointment = async (id) => {
    const response = await fetch(`${API_URL}appointments/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar el turno");
    }

    return response.json();
};
