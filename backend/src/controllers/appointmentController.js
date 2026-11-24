
import pool from '../config/db.js';

// VALIDATE AMOUNT
const isValidAmount = (amount) => {
  return (
    (typeof amount === "number" || typeof amount === "string") &&
    /^\d+(\.\d{1,2})?$/.test(String(amount)) &&
    Number.isFinite(Number(amount)) &&
    Number(amount) >= 0 &&
    Number(amount) <= 99999999.99
  );
};

// GET APPOINTMENTS
export const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        appointments.*,
        clients.name,
        clients.phone,
        clients.is_active
      FROM appointments
      JOIN clients
        ON appointments.client_id = clients.id
      ORDER BY appointments.start_time
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
};

// GET APPOINTMENT BY ID
export const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        appointments.*,
        clients.name,
        clients.phone
      FROM appointments
      JOIN clients
        ON appointments.client_id = clients.id
      WHERE appointments.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Turno no encontrado"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el turno" });
  }
};

// GET ALL APPOINTMENTS BY CLIENT ID
export const getAppointmentsByClientId = async (req, res) => {
  const { client_id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        appointments.*,
        clients.name,
        clients.phone
      FROM appointments
      JOIN clients
        ON appointments.client_id = clients.id
      WHERE appointments.client_id = $1
      ORDER BY appointments.start_time DESC
    `, [client_id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener los turnos del cliente"
    });
  }
};

// CREATE APPOINTMENT
export const createAppointment = async (req, res) => {
  const {
    client_id,
    start_time,
    end_time,
    notes,
    expected_amount = 0
  } = req.body;

  if (!client_id || !start_time || !end_time) {
    return res.status(400).json({
      error: "El ID de cliente, el horario de comienzo y final son obligatorios"
    });
  }

  if (!isValidAmount(expected_amount)) {
    return res.status(400).json({
      error: "El importe esperado debe ser válido y no negativo"
    });
  }

  const date_start_time = new Date(start_time);
  const date_end_time = new Date(end_time);

  if (
    Number.isNaN(date_start_time.getTime()) ||
    Number.isNaN(date_end_time.getTime())
  ) {
    return res.status(400).json({
      error: "Los horarios deben ser válidos"
    });
  }

  if (!Number.isInteger(Number(client_id)) || Number(client_id) <= 0) {
    return res.status(400).json({
      error: "El ID del cliente debe ser válido"
    });
  }

  if (date_start_time >= date_end_time) {
    return res.status(400).json({
      error: "El horario final debe ser posterior al horario de comienzo"
    });
  }

  try {
    const clientResult = await pool.query(`
      SELECT id
      FROM clients
      WHERE id = $1
      AND is_active = TRUE
    `, [client_id]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró un cliente activo con el ID seleccionado"
      });
    }

    const appointmentConflictResult = await pool.query(`
      SELECT id
      FROM appointments
      WHERE start_time < $2
      AND end_time > $1
      AND status != 'cancelled'
    `, [start_time, end_time]);

    if (appointmentConflictResult.rows.length > 0) {
      return res.status(409).json({
        error: "Ya existe un turno en ese horario"
      });
    }

    const result = await pool.query(`
      INSERT INTO appointments (
        client_id,
        start_time,
        end_time,
        notes,
        expected_amount
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      client_id,
      start_time,
      end_time,
      notes,
      expected_amount
    ]);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    if (error.code === "23P01") {
      return res.status(409).json({
        error: "El horario se superpone con otro turno existente"
      });
    }

    console.error(error);
    res.status(500).json({ error: "Error al crear turno" });
  }
};

// UPDATE APPOINTMENT BY ID
export const updateAppointment = async (req, res) => {
  const { id } = req.params;

  const {
    client_id,
    start_time,
    end_time,
    notes,
    expected_amount
  } = req.body;

  if (!client_id || !start_time || !end_time) {
    return res.status(400).json({
      error: "El ID de cliente, el horario de comienzo y final son obligatorios"
    });
  }

  if (
    expected_amount !== undefined &&
    !isValidAmount(expected_amount)
  ) {
    return res.status(400).json({
      error: "El importe esperado debe ser válido y no negativo"
    });
  }

  const date_start_time = new Date(start_time);
  const date_end_time = new Date(end_time);

  if (
    Number.isNaN(date_start_time.getTime()) ||
    Number.isNaN(date_end_time.getTime())
  ) {
    return res.status(400).json({
      error: "Los horarios deben ser válidos"
    });
  }

  if (!Number.isInteger(Number(client_id)) || Number(client_id) <= 0) {
    return res.status(400).json({
      error: "El ID del cliente debe ser válido"
    });
  }

  if (date_start_time >= date_end_time) {
    return res.status(400).json({
      error: "El horario final debe ser posterior al horario de comienzo"
    });
  }

  try {
    const existingAppointment = await pool.query(`
      SELECT id
      FROM appointments
      WHERE id = $1
    `, [id]);

    if (existingAppointment.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró el turno"
      });
    }

    const clientResult = await pool.query(`
      SELECT id
      FROM clients
      WHERE id = $1
      AND is_active = TRUE
    `, [client_id]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        error: "El cliente no existe o no está activo"
      });
    }

    const appointmentConflictResult = await pool.query(`
      SELECT id
      FROM appointments
      WHERE start_time < $2
      AND end_time > $1
      AND status != 'cancelled'
      AND id != $3
    `, [start_time, end_time, id]);

    if (appointmentConflictResult.rows.length > 0) {
      return res.status(409).json({
        error: "Ya existe un turno en ese horario"
      });
    }

    const result = await pool.query(`
      UPDATE appointments
      SET client_id = $2,
          start_time = $3,
          end_time = $4,
          notes = $5,
          expected_amount = COALESCE($6, expected_amount)
      WHERE id = $1
      RETURNING *
    `, [
      id,
      client_id,
      start_time,
      end_time,
      notes,
      expected_amount ?? null
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró el turno"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    if (error.code === "23P01") {
      return res.status(409).json({
        error: "El horario se superpone con otro turno existente"
      });
    }

    console.error(error);
    res.status(500).json({ error: "Error al modificar turno" });
  }
};

// UPDATE APPOINTMENT STATUS
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["scheduled", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({
      error: "El estado debe ser válido"
    });
  }

  try {
    const result = await pool.query(`
      UPDATE appointments
      SET status = $2
      WHERE id = $1
      RETURNING *
    `, [id, status]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró turno"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al modificar estado de turno"
    });
  }
};

// UPDATE APPOINTMENT PAYMENT
export const updateAppointmentPayment = async (req, res) => {
  const { id } = req.params;

  const {
    received_amount,
    payment_method = null
  } = req.body;

  if (!isValidAmount(received_amount)) {
    return res.status(400).json({
      error: "El importe recibido debe ser válido y no negativo"
    });
  }

  if (
    payment_method !== null &&
    !["pix", "cash"].includes(payment_method)
  ) {
    return res.status(400).json({
      error: "El método de pago debe ser PIX o efectivo"
    });
  }

  if (
    Number(received_amount) > 0 &&
    payment_method === null
  ) {
    return res.status(400).json({
      error: "Debe seleccionar un método de pago"
    });
  }

  const finalPaymentMethod =
    Number(received_amount) === 0 ? null : payment_method;

  try {
    const result = await pool.query(`
      UPDATE appointments
      SET received_amount = $2,
          payment_method = $3
      WHERE id = $1
      RETURNING *
    `, [
      id,
      received_amount,
      finalPaymentMethod
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Turno no encontrado"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al registrar el pago"
    });
  }
};

// DELETE APPOINTMENT
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      DELETE FROM appointments
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Turno no encontrado"
      });
    }

    res.status(200).json({
      message: "Turno eliminado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al eliminar el turno"
    });
  }
};
