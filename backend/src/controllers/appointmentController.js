import pool from '../config/db.js';

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
        appointments.notes
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
