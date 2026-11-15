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
