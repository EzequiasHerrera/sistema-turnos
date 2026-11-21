import { useEffect, useState } from "react";
import { getClients, createClients } from "../services/clientsService.js";
import { createAppointment, updateAppointment } from "../services/appointmentService";

const formatDateForInput = (date) => {
	if (!date) return "";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

const AppointmentModal = ({ selectedDate, appointment = null, onClose, onCreated }) => {
	const isEditing = Boolean(appointment);
	const [clients, setClients] = useState([]);
	const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
	const [editingAppointment, setEditingAppointment] = useState(null);
	const [isCreatingClient, setIsCreatingClient] = useState(false);
	const [newClient, setNewClient] = useState({ name: "", phone: "", });
	const [formData, setFormData] = useState({
		client_id: appointment ? String(appointment.client_id) : "",
		date: appointment
			? appointment.start_time.slice(0, 10)
			: formatDateForInput(selectedDate),
		start_time: appointment
			? appointment.start_time.slice(11, 16)
			: "",
		end_time: appointment
			? appointment.end_time.slice(11, 16)
			: "",
		notes: appointment?.notes ?? "",
	});

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await getClients();
				setClients(data);
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

	const handleSubmit = async (e) => {
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

		try {
			setIsWaitingForResponse(true);
			if (isEditing) {
				await updateAppointment(appointment.id, appointmentData);
			} else {
				await createAppointment(appointmentData);
			}
			onCreated();
		} catch (error) {
			console.error("Error al crear el turno", error);
		} finally {
			setIsWaitingForResponse(false);
		}

	};

	const handleClientChange = (e) => {
		const { name, value } = e.target;

		setNewClient((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCreateClient = async (e) => {
		if (!newClient.name.trim() || !newClient.phone.trim()) {
			alert("Nombre y teléfono son obligatorios.");
			return;
		}

		try {
			setIsWaitingForResponse(true);

			const createdClient = await createClients(newClient);

			setClients((prev) => [...prev, createdClient]);

			setFormData((prev) => ({
				...prev,
				client_id: String(createdClient.id),
			}));

			setIsCreatingClient(false);
			setNewClient({ name: "", phone: "" });
		} catch (error) {
			console.error("Error al crear el cliente:", error);
		} finally {
			setIsWaitingForResponse(false);
		}

	}

	return (
		<div
			className="modal-overlay"
			onClick={() => {
				if (!isWaitingForResponse) onClose();
			}}
		>
			<form
				className="appointment-modal"
				onSubmit={handleSubmit}
				onClick={(e) => e.stopPropagation()}>

				<header className="appointment-modal__header">
					<h2>{isEditing ? "Editar turno" : "Nuevo turno"}</h2>

					<button
						type="button"
						className="appointment-modal__close"
						onClick={onClose}
						aria-label="Cerrar formulario"
						disabled={isWaitingForResponse}
					>
						&times;
					</button>
				</header>

				<div className="appointment-modal__field">
					<label htmlFor="client_id">Cliente</label>

					<div className="client_and_button">
						<select
							id="client_id"
							name="client_id"
							value={formData.client_id}
							onChange={handleChange}
							required
							disabled={isWaitingForResponse}
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
						<button
							className="appointment-modal__submit"
							type="button"
							onClick={() => setIsCreatingClient((prev) => !prev)}
						>
							{isCreatingClient ? "Cancelar" : "+"}
						</button>
					</div>

					{isCreatingClient && (
						<div className="appointment-modal__new-client">
							<div className="appointment-modal__field">
								<label htmlFor="client_name">Nombre</label>
								<input
									type="text"
									id="client_name"
									name="name"
									value={newClient.name}
									onChange={handleClientChange}
								/>
							</div>

							<div className="appointment-modal__field">
								<label htmlFor="client_phone">Teléfono</label>
								<input
									type="tel"
									id="client_phone"
									name="phone"
									value={newClient.phone}
									onChange={handleClientChange}
								/>
							</div>
							<button
								type="button"
								className="appointment-modal__submit"
								onClick={handleCreateClient}
							>
								Guardar cliente
							</button>
						</div>
					)}
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
						disabled={isWaitingForResponse}
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
							disabled={isWaitingForResponse}
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
							required
							disabled={isWaitingForResponse}
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
						disabled={isWaitingForResponse}
					/>
				</div>

				<button className="appointment-modal__submit"
					type="submit"
					disabled={isWaitingForResponse}>
					{isWaitingForResponse ? "Guardando..." : "Guardar turno"}
				</button>
			</form>
		</div>
	);
};

export default AppointmentModal;
