// // server/db.js
// import sqlite3 from "sqlite3";
// import path from "path";
// import { fileURLToPath } from "url";

// sqlite3.verbose();

// // Fix __dirname for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, "database.db");

// const db = new sqlite3.Database(DB_FILE, (err) => {
//   if (err) {
//     console.error("Failed to connect to DB:", err.message);
//     process.exit(1);
//   }
//   console.log("Connected to SQLite DB:", DB_FILE);
// });

// export default db;



// server/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "database.db");

// Open SQLite database with async/await support
const db = await open({
  filename: DB_FILE,
  driver: sqlite3.Database,
});

console.log("✅ Connected to SQLite DB:", DB_FILE);

export default db;
