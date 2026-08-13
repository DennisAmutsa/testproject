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

const rawClientUrls = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawClientUrls.split(',').map(url => url.trim().replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes('*') || cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback to allow client requests
  },
  credentials: true
}));
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
