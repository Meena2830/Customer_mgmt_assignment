import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './db.js';
import customersRouter from './routes/customers.js';
import  addressesRouter  from './routes/addresses.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/customers', customersRouter);
app.use('/api', addressesRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
