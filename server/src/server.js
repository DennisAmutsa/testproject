import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api/auth',    authRoutes);
app.use('/api/orders',  orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/stock',   stockRoutes);
app.use('/api/help',    helpRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: '🌟 Northstar API running', env: process.env.NODE_ENV })
);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🌟 Northstar server running on port ${PORT} [${process.env.NODE_ENV}]`)
);
