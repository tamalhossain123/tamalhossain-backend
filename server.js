const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Vercel Serverless MongoDB Connection Caching
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }
    if (!process.env.MONGO_URI) {
        console.warn('⚠️ MONGO_URI environment variable is missing!');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// ==========================================
// 1. ADMIN AUTHENTICATION API
// ==========================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tamalhossain908@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'iam@tamal@123#@';
const JWT_SECRET = process.env.JWT_SECRET || 'tamal_portfolio_secret_key_2026';

// উভয় কমন লগইন রাউট হ্যান্ডেল করা হলো
const handleLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (email === ADMIN_EMAIL && (password === ADMIN_PASSWORD || password === process.env.ADMIN_PASSWORD)) {
        const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            success: true,
            token,
            message: 'Authentication successful',
            admin: { email: ADMIN_EMAIL, name: 'Md. Tamal Hossain' }
        });
    }

    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};

app.post('/api/auth/login', handleLogin);
app.post('/api/admin/login', handleLogin);
app.post('/api/login', handleLogin);

// ==========================================
// 2. PORTFOLIO DATA SCHEMAS & MODELS
// ==========================================
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, default: 'website' },
    actionType: { type: String, default: 'live' },
    scrollMode: { type: String, default: 'normal' },
    liveUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' }
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// Profile Schema
const ProfileSchema = new mongoose.Schema({
    siteLogo: { type: String, default: '' },
    siteFavicon: { type: String, default: '' },
    dashboardAvatar: { type: String, default: '' },
    projectCategories: { type: [String], default: ['website', 'wordpress', 'graphic', 'photoshop', 'uiux'] },
    badgeText: { type: String, default: '- I AM MD. TAMAL HOSSAIN' },
    name: { type: String, default: 'Md. Tamal Hossain' },
    typingTitles: { type: String, default: 'Front-End Developer, WordPress Specialist, Full-Stack Developer' },
    heroTagline: { type: String, default: 'Crafting high-performance modern web applications and scalable solutions.' },
    aboutBio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resumeFile: { type: String, default: '' },
    funfacts: [{ number: String, label: String, icon: String }],
    services: [{ title: String, icon: String, desc: String }],
    technologies: [{ name: String, logo: String }],
    skills: [{ name: String, percentage: Number }],
    education: [{ degree: String, institute: String, year: String }],
    experience: [{ role: String, company: String, duration: String, description: String }],
    email: { type: String, default: 'tamalhossain908@gmail.com' },
    phone: { type: String, default: '+880 1730048626' },
    address: { type: String, default: 'Dhaka, Bangladesh' },
    socialLinks: [{ name: String, icon: String, url: String }]
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

// ==========================================
// 3. API ROUTES (Profile & Projects)
// ==========================================

// GET Profile
app.get('/api/profile', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) profile = await Profile.create({});
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// POST Profile Updates
app.post('/api/profile', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) profile = new Profile();
        Object.assign(profile, req.body);
        const updated = await profile.save();
        res.status(200).json({ message: 'Profile updated successfully', profile: updated });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

// GET Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// POST Add Project
app.post('/api/projects', async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add project' });
    }
});

// DELETE Project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'live', message: 'Portfolio Master CMS Backend Running' });
});

// Local Development Server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;