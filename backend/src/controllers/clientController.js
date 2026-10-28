import pool from '../config/db.js';

//GET CLIENTS
export const getClients = async (req, res) => {
    try {
        const result = await pool.query(`
           SELECT
            clients.id,
            clients.name,
            clients.phone,
            clients.is_active,
            clients.created_at
            FROM clients
            ORDER BY clients.id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los clientes' })
    }
};
//GET CLIENT BY:ID
export const getClientById = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(`
           SELECT
            clients.id,
            clients.name,
            clients.phone,
            clients.created_at
            FROM clients
            WHERE clients.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el cliente por su ID' })
    }
};
//CREATE
export const createClient = async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;

    if (hasInvalidText(name, phone)) {
        res.status(400).json({ error: "Nombre y telefono son obligatorios y deben ser texto" });
        return;
    }

    try {
        const result = await pool.query(`
            INSERT INTO clients (name, phone)
            VALUES ($1, $2)
            RETURNING *
            `, [name.trim(), phone.trim()]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el cliente' })
    }
}
//UPDATE:ID
export const updateClient = async (req, res) => {
    const id = req.params.id;

    const name = req.body.name;
    const phone = req.body.phone;

    if (hasInvalidText(name, phone)) {
        res.status(400).json({ error: "Nombre y telefono son obligatorios y deben ser texto" });
        return;
    }

    try {
        const result = await pool.query(`
           UPDATE clients
           SET name = $2,
               phone = $3
           WHERE id = $1
           RETURNING *
        `, [id, name.trim(), phone.trim()]);

        if(result.rows.length === 0){
            res.status(404).json({error: "ID de cliente no encontrado"})
            return;
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar cliente' })
    }
};
//UNABLE CLIENT:ID
export const toggleClientStatus = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(`
           UPDATE clients
           SET is_active = NOT is_active
           WHERE clients.id = $1
           RETURNING *
        `, [id]);

        if(result.rows.length === 0){
            res.status(404).json({error: "ID de cliente no encontrado"})
            return;
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar estado de cliente' })
    }
}

const hasInvalidText = (...values) => {
    return values.some((value) => typeof value !== "string" || value.trim() === "");
};

