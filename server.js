const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// User মডেলটি ইমপোর্ট করা হলো
const User = require('./models/user');

const app = express();

// Middlewares
// আপনার ফ্রন্টএন্ড এবং সিএমএস এর ডোমেইনগুলো এখানে দিতে পারেন, আপাতত origin: true রাখা হলো।
app.use(cors({ origin: true, credentials: true })); 
// Base64 ইমেজের সাইজ বড় হতে পারে, তাই লিমিট 50mb করে দেওয়া হলো
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// 1. SAFE MONGODB CONNECTION FOR SERVERLESS
// ==========================================
let isConnected = false;
const connectDB = async (req, res, next) => {
    
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return next();
    }
    if (!process.env.MONGO_URI) {
        console.warn('⚠️ MONGO_URI missing in Environment Variables!');
        return res.status(500).json({ error: 'Database configuration missing' });
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected Successfully');

        // ==========================================
        // অ্যাডমিন অ্যাকাউন্ট অটো-ক্রিয়েট লজিক 
        // ==========================================
        const adminExists = await User.findOne({ email: 'tamalhossain908@gmail.com' });
        if (!adminExists) {
            await User.create({
                email: 'tamalhossain908@gmail.com',
                password: 'iam@tamal@123#@'
            });
            console.log('✅ Admin Account Auto-Created Successfully!');
        }

        next();
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
};

// ডাটাবেজ কানেকশন মিডলওয়্যারটি শুধু /api রাউটগুলোতে অ্যাপ্লাই করা হলো
app.use('/api', connectDB);

// ==========================================
// 2. IMPORT & USE MODULAR ROUTES
// ==========================================
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/projects');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);

// ==========================================
// 3. ROOT HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
    res.json({ status: 'live', message: 'Portfolio Master CMS Backend Running perfectly!' });
});

// Local Development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;