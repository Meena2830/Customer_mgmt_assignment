import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all addresses for a customer
// Get all addresses for a customer
router.get('/customers/:id/addresses', async (req, res) => {
  try {
    const addresses = await db.all(
      `SELECT 
        id, 
        street AS address_details, 
        city, 
        state, 
        zip_code AS pin_code 
      FROM addresses 
      WHERE customer_id = ?`,
      [req.params.id]
    );

    // Always return an array
    res.json({ message: 'success', data: addresses || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});


// Create a new address for a customer
// Create a new address
// Create a new address for a customer
router.post('/customers/:id/addresses', async (req, res) => {
  const { address_details, city, state, pin_code } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO addresses (customer_id, street, city, state, zip_code) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, address_details, city, state, pin_code]
    );

    // Fetch the newly inserted row with proper aliases
    const newAddress = await db.get(
      `SELECT 
        id, 
        street AS address_details, 
        city, 
        state, 
        zip_code AS pin_code 
       FROM addresses 
       WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json({ message: 'success', data: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});


// Update address
router.put('/addresses/:id', async (req, res) => {
  const { id } = req.params;
  const { address_details, city, state, pin_code } = req.body;
  try {
    await db.run(
      'UPDATE addresses SET street = ?, city = ?, state = ?, zip_code = ? WHERE id = ?',
      [address_details, city, state, pin_code, id]
    );
    res.json({ message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update address' });
  }
});


// Delete address
router.delete('/addresses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM addresses WHERE id = ?', id);
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

export default router;
