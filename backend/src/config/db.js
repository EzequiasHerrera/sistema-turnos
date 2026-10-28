
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
pg.types.setTypeParser(1114, value => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
