import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

let connection;
try {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} catch (error) {
  console.log(error);
}

export default connection;
