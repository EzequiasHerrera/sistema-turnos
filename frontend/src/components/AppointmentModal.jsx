import { useState } from "react";

const AppointmentModal = () => {
	const [formData, setFormData] = useState({
		client_id: "",
		date: "",
		start_time: "",
		end_time: "",
		notes: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Datos del turno:", formData);
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
				<option value="1">Nicole Apellido</option>
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
