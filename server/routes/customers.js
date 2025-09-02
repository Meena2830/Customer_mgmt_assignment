// import express from 'express';
// import db from "../db.js";


// const router = express.Router();

// /*
// Routes:
// POST   /api/customers
// GET    /api/customers
// GET    /api/customers/:id
// PUT    /api/customers/:id
// DELETE /api/customers/:id
// */

// // Create
// router.post('/', (req, res) => {
//   const { first_name, last_name, phone_number } = req.body;
//   if (!first_name || !last_name || !phone_number) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }
//   const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
//   db.run(sql, [first_name, last_name, phone_number], function (err) {
//     if (err) return res.status(400).json({ error: err.message });
//     res.status(201).json({ message: 'success', id: this.lastID });
//   });
// });

// // List with optional search, page, limit, sort
// router.get('/', (req, res) => {
//   const { q, city, page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;
//   const offset = (page - 1) * limit;

//   let base = `SELECT c.* FROM customers c`;
//   const params = [];

//   if (city) {
//     base += ` INNER JOIN addresses a ON a.customer_id = c.id`;
//   }

//   const where = [];
//   if (q) {
//     where.push(`(c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone_number LIKE ?)`);
//     params.push(`%${q}%`, `%${q}%`, `%${q}%`);
//   }
//   if (city) {
//     where.push(`a.city = ?`);
//     params.push(city);
//   }

//   const whereClause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
//   const sql = `${base}${whereClause} GROUP BY c.id ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
//   params.push(Number(limit), Number(offset));

//   db.all(sql, params, (err, rows) => {
//     if (err) return res.status(400).json({ error: err.message });
//     res.json({ message: 'success', data: rows });
//   });
// });

// // Get one
// router.get('/:id', (req, res) => {
//   const sql = `SELECT * FROM customers WHERE id = ?`;
//   db.get(sql, [req.params.id], (err, row) => {
//     if (err) return res.status(400).json({ error: err.message });
//     if (!row) return res.status(404).json({ error: 'Customer not found' });
//     res.json({ message: 'success', data: row });
//   });
// });

// // Update
// router.put('/:id', (req, res) => {
//   const { first_name, last_name, phone_number } = req.body;
//   const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`;
//   db.run(sql, [first_name, last_name, phone_number, req.params.id], function (err) {
//     if (err) return res.status(400).json({ error: err.message });
//     if (this.changes === 0) return res.status(404).json({ error: 'Customer not found' });
//     res.json({ message: 'updated' });
//   });
// });

// // Delete
// router.delete('/:id', (req, res) => {
//   const sql = `DELETE FROM customers WHERE id = ?`;
//   db.run(sql, [req.params.id], function (err) {
//     if (err) return res.status(400).json({ error: err.message });
//     if (this.changes === 0) return res.status(404).json({ error: 'Customer not found' });
//     res.json({ message: 'deleted' });
//   });
// });

// export default router; // ✅ now works with `import customersRouter`



// server/routes/customers.js
import express from 'express';
import db from "../db.js";

const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await db.run(
      `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`,
      [first_name, last_name, phone_number]
    );
    res.status(201).json({ message: 'success', id: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List with optional search
router.get('/', async (req, res) => {
  try {
    const { q, city, page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let base = `SELECT c.* FROM customers c`;
    const params = [];

    if (city) base += ` INNER JOIN addresses a ON a.customer_id = c.id`;

    const where = [];
    if (q) {
      where.push(`(c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone_number LIKE ?)`);
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (city) {
      where.push(`a.city = ?`);
      params.push(city);
    }

    const whereClause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
    const sql = `${base}${whereClause} GROUP BY c.id ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const rows = await db.all(sql, params);
    res.json({ message: 'success', data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const row = await db.get(`SELECT * FROM customers WHERE id = ?`, [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'success', data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;
    const result = await db.run(
      `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`,
      [first_name, last_name, phone_number, req.params.id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run(`DELETE FROM customers WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
