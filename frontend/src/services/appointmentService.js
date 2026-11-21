//GET APPOINTMENT
export const getAppointments = async () => {
	const response = await fetch(
		"https://sistema-turnos-seven.vercel.app/api/appointments/",
	);

	if (!response.ok) {
		throw new Error("No se pudieron obtener los turnos");
	}

	const appointments = await response.json();
	return appointments;
};

//CREATE APPOINTMENT
export const createAppointment = async (appointmentData) => {
	const response = await fetch(
		"https://sistema-turnos-seven.vercel.app/api/appointments",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(appointmentData),
		},
	);

	if (!response.ok) {
		throw new Error("No se pudo crear el turno");
	}

	return response.json();
};

//UPDATE APPOINTMENT STATUS
export const updateAppointmentStatus = async (id, status) => {
    const response = await fetch(
        `https://sistema-turnos-seven.vercel.app/api/appointments/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        },
    );

    if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del turno");
    }

    return response.json();
};

//DELETE APPOINTMENT BY ID
export const deleteAppointment = async (id) => {
    const response = await fetch(
        `https://sistema-turnos-seven.vercel.app/api/appointments/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("No se pudo eliminar el turno");
    }

    return response.json();
};