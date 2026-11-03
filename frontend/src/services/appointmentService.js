export const getAppointments = async () => {
    const response = await fetch("https://sistema-turnos-seven.vercel.app/api/appointments/");

    if (!response.ok) {
        throw new Error("No se pudieron obtener los turnos");
    }

    const appointments = await response.json();
    return appointments;
};