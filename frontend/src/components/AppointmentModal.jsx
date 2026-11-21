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

const AppointmentModal = ({ selectedDate, onClose }) => {
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

		if (formData.end_time <= formData.start_time) {
			alert("La hora de finalización debe ser posterior a la de inicio.");
			return;
		}

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
		<div
			className="modal-overlay"
			onClick={onClose}
		>
			<form
				className="appointment-modal"
				onSubmit={handleSubmit}
				onClick={(e) => e.stopPropagation()}>

				<header className="appointment-modal__header">
					<h2>Nuevo turno</h2>

					<button
						type="button"
						className="appointment-modal__close"
						onClick={onClose}
						aria-label="Cerrar formulario"
					>
						&times;
					</button>
				</header>

				<div className="appointment-modal__field">
					<label htmlFor="client_id">Cliente</label>
					<select
						id="client_id"
						name="client_id"
						value={formData.client_id}
						onChange={handleChange}
						required
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
				</div>

				<div className="appointment-modal__field">
					<label htmlFor="date">Día de turno</label>
					<input
						id="date"
						type="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="appointment-modal__hours">
					<div className="appointment-modal__field">
						<label htmlFor="start_time">Desde</label>
						<input
							type="time"
							id="start_time"
							name="start_time"
							value={formData.start_time}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="appointment-modal__field">
						<label htmlFor="end_time">Hasta</label>
						<input
							type="time"
							id="end_time"
							name="end_time"
							value={formData.end_time}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="appointment-modal__field">
					<label htmlFor="notes">Observación</label>
					<textarea
						id="notes"
						name="notes"
						value={formData.notes}
						onChange={handleChange}
					/>
				</div>

				<button className="appointment-modal__submit" type="submit">
					Guardar turno
				</button>
			</form>
		</div>
	);
};

export default AppointmentModal;
