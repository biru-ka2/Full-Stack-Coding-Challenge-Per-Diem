const { Pool } = require("pg");
const { env } = require("../config/env");

let pool = null;

if (env.database) {
  pool = new Pool({
    host: env.database.host,
    port: env.database.port,
    database: env.database.name,
    user: env.database.user,
    password: env.database.password,
    ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
  });
}

module.exports = { pool };
