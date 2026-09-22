const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');

const envPath = path.join(process.cwd(), '.env.local');
const envLine = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find((line) => line.startsWith('DATABASE_URL='))
  : null;

if (!envLine) {
  console.error('DATABASE_URL is missing from .env.local.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: envLine.slice('DATABASE_URL='.length),
  ssl: { rejectUnauthorized: false },
});

pool.query('select to_regclass($1) as table_name', ['public.workshop_registrations'])
  .then((result) => {
    console.log(result.rows[0].table_name ? 'CONNECTED: workshop table exists.' : 'CONNECTED: workshop table is missing. Run the SQL migration in Supabase.');
    process.exitCode = result.rows[0].table_name ? 0 : 2;
  })
  .catch((error) => {
    console.error(`DATABASE ERROR: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
