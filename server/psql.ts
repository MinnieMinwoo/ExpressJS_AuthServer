import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const psql = new Client({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: parseInt(<string>process.env.PSQL_PORT),
});
psql.connect();
export default psql;
