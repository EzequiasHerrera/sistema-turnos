import pool from '../config/db.js';

//GET APPOINTMENTS
export const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        appointments.id,
        clients.name,
        clients.phone,
        appointments.start_time,
        appointments.end_time,
        appointments.status,
        appointments.notes,
        clients.is_active
      FROM appointments
      JOIN clients
        ON appointments.client_id = clients.id
      ORDER BY appointments.start_time;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los turnos' });
  }
};
//GET APPOINTMENT BY:ID
export const getAppointmentById = async (req, res) => {
  const id = req.params.id

  try {
    const result = await pool.query(`
      SELECT
        appointments.id,
        clients.name,
        clients.phone,
        appointments.start_time,
        appointments.end_time,
        appointments.status,
        appointments.notes
      FROM appointments
      JOIN clients
        ON appointments.client_id = clients.id
      WHERE appointments.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Turno no encontrado" })
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los turnos' });
  }
}

//CREATE APPOINTMENT
export const createAppointment = async (req, res) => {
  const { client_id, start_time, end_time, notes } = req.body;


  if (!client_id || !start_time || !end_time) {
    res.status(400).json({ error: "El ID de cliente, el horario de comienzo y final son obligatorios" })
    return;
  }

  const date_start_time = new Date(start_time);
  const date_end_time = new Date(end_time);

  if (Number.isNaN(date_start_time.getTime()) || Number.isNaN(date_end_time.getTime())) {
    res.status(400).json({ error: "Los Horarios deben ser válidos" })
    return;
  };

  if (date_start_time >= date_end_time) {
    res.status(400).json({ error: "El Horario final no puede ser anterior al horario de comienzo" })
    return;
  };

  try {
    const clientResult = await pool.query(`
      SELECT id
      FROM clients
      WHERE clients.id = $1 
      AND is_active = TRUE
      `, [client_id]);

    if (clientResult.rows.length === 0) {
      res.status(404).json({ error: "No se encontró un cliente con el ID seleccionado" });
      return;
    }

    const appointmentResult = await pool.query(`
      INSERT INTO appointments (client_id, start_time, end_time, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `, [client_id, start_time, end_time, notes]);

      res.status(201).json(appointmentResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear turno' });
  }
}
//UPDATE APPOINTMENT BY ID