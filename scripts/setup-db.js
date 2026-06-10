const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Basic manual parsing of .env.local to support older Node versions
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('Error: DATABASE_URL is not defined in environment or .env.local');
  process.exit(1);
}

async function main() {
  console.log('Connecting to database...');
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log('Successfully connected.');

    const schemaPath = path.join(__dirname, '../src/lib/db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Initializing schema...');
    await client.query(schemaSql);
    console.log('Database schema initialized successfully!');
  } catch (err) {
    console.error('Error setting up database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
