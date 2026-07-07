import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import importRouter from './routes/import.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import API Route
app.use('/api/import', importRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` GrowEasy CRM CSV Importer Backend active `);
  console.log(` Running on port: ${PORT}                  `);
  console.log(` Allowed Origin: ${FRONTEND_URL}           `);
  console.log(`=========================================`);
});
