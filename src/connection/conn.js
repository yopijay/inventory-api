const Pool = require('pg').Pool;
const config = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    user: 'pijay',
    host: 'localhost',
    database: 'inventory',
    password: 'root',
    port: 5432
}

const pool = new Pool(config);
module.exports = pool;