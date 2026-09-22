const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Routes
const profileRoute = require('./routes/profile');
const projectRoute = require('./routes/projects');
const authRoute = require('./routes/auth');

const app = express();

// Database Connection
connectDB();

// 1. CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parser (Base64 ও বড় ফর্ম ডেটা সেভ করার জন্য 50mb লিমিট)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Serve Uploads & Admin UI Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// 4. API Routes (উভয় সিঙ্গুলার ও প্লুরাল সাপোর্ট সহ)
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/profiles', profileRoute); // Fallback alias
app.use('/api/projects', projectRoute);

// 5. Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Portfolio Backend API is running smoothly!' });
});

// 6. Root Route
app.get('/', (req, res) => {
  res.send('Portfolio Backend is live. Go to <a href="/admin">/admin</a> to manage content.');
});

// Server Listen
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
  });
}

module.exports = app;