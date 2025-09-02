// initDb.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const initDb = async () => {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  // 🚨 Drop old tables if they exist
  await db.exec(`DROP TABLE IF EXISTS addresses`);
  await db.exec(`DROP TABLE IF EXISTS customers`);

  // ✅ Create fresh customers table
  await db.exec(`
    CREATE TABLE customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL
    )
  `);

  // ✅ Create fresh addresses table
await db.exec(`
  CREATE TABLE addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    street TEXT,              -- removed NOT NULL
    city TEXT,                -- removed NOT NULL
    state TEXT,               -- removed NOT NULL
    zip_code TEXT,            -- removed NOT NULL
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  )
`);


  console.log('✅ Database initialized with fresh schema');
};

initDb();
