const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// পরিবর্তন করে লিখুন:
const profileRoute = require('./routes/profile');

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads & Admin UI Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Portfolio Backend API is running smoothly!' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Portfolio Backend is live. Go to <a href="/admin">/admin</a> to manage content.');
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
});
module.exports = app;