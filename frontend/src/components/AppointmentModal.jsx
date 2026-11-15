import { useEffect, useState } from "react";
import { getClients } from "../services/clientsService.js";
import { createAppointment } from "../services/appointmentService";

const formatDateForInput = (date) => {
	if (!date) return "";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

const AppointmentModal = ({ selectedDate }) => {
	const [clients, setClients] = useState([]);
	const [formData, setFormData] = useState({
		client_id: "",
		date: formatDateForInput(selectedDate),
		start_time: "",
		end_time: "",
		notes: "",
	});

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await getClients();
				setClients(data);
				console.log("Clientes recibidos:", data);
			} catch (error) {
				console.error("Error al obtener clientes:", error);
			}
		};

		fetchClients();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const appointmentData = {
			client_id: Number(formData.client_id),
			start_time: `${formData.date}T${formData.start_time}:00`,
			end_time: `${formData.date}T${formData.end_time}:00`,
			notes: formData.notes,
		};

		console.log("Turno preparado:", appointmentData);
		createAppointment(appointmentData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="client_id">Cliente</label>
			<select
				id="client_id"
				name="client_id"
				value={formData.client_id}
				onChange={handleChange}
			>
				<option value="">Seleccionar cliente</option>
				{clients
					.filter((client) => client.is_active)
					.map((client) => (
						<option key={client.id} value={client.id}>
							{client.name}
						</option>
					))}
			</select>

			<label htmlFor="date">Día de turno</label>
			<input
				id="date"
				type="date"
				name="date"
				value={formData.date}
				onChange={handleChange}
			/>

			<label htmlFor="start_time">Hora de inicio</label>
			<input
				type="time"
				id="start_time"
				name="start_time"
				value={formData.start_time}
				onChange={handleChange}
			/>

			<label htmlFor="end_time">Hora de finalización</label>
			<input
				type="time"
				id="end_time"
				name="end_time"
				value={formData.end_time}
				onChange={handleChange}
			/>

			<label htmlFor="notes">Observación</label>
			<textarea
				id="notes"
				name="notes"
				value={formData.notes}
				onChange={handleChange}
			/>

			<button type="submit">Guardar turno</button>
		</form>
	);
};

export default AppointmentModal;
