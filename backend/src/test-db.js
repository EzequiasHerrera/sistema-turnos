import pool from './config/db.js';

try {
  const result = await pool.query('SELECT NOW()');
  console.log('Conexión exitosa:', result.rows[0]);
} catch (error) {
  console.error('Error de conexión:', error.message);
} finally {
  await pool.end();
}