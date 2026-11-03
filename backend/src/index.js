import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import appointmentRoutes from './routes/appointmentRoutes.js';
import clientRoutes from './routes/clientRoutes.js'

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});