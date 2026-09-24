const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middlewares (Express 5 এ শুধু app.use(cors) দিলেই OPTIONS হ্যান্ডেল হয়ে যায়)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ==========================================
// 1. ADMIN AUTHENTICATION API (NON-BLOCKING)
// ==========================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tamalhossain908@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'iam@tamal@123#@';
const JWT_SECRET = process.env.JWT_SECRET || 'tamal_portfolio_secret_key_2026';

const handleLogin = (req, res) => {
    const email = req.body.email || req.body.adminEmail || req.body.username;
    const password = req.body.password || req.body.adminPassword;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetEmail = ADMIN_EMAIL.trim().toLowerCase();

    if (cleanEmail === targetEmail && (password === ADMIN_PASSWORD || password === process.env.ADMIN_PASSWORD)) {
        const token = jwt.sign({ email: targetEmail, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            success: true,
            token,
            message: 'Authentication successful',
            admin: { email: targetEmail, name: 'Md. Tamal Hossain' }
        });
    }

    return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin email or password' 
    });
};

// All Auth Endpoints
app.post('/api/auth/login', handleLogin);
app.post('/api/admin/login', handleLogin);
app.post('/api/login', handleLogin);
app.post('/admin/login', handleLogin);
app.post('/admin', handleLogin);

// ==========================================
// 2. SAFE MONGODB CONNECTION
// ==========================================
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }
    if (!process.env.MONGO_URI) {
        console.warn('⚠️ MONGO_URI missing in Environment Variables!');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
    }
};

const requireDB = async (req, res, next) => {
    await connectDB();
    next();
};

// ==========================================
// 3. SCHEMAS & MODELS
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
// 4. CMS API ROUTES
// ==========================================

// Profile Routes
app.get('/api/profile', requireDB, async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) profile = await Profile.create({});
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.post('/api/profile', requireDB, async (req, res) => {
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

// Projects Routes
app.get('/api/projects', requireDB, async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', requireDB, async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add project' });
    }
});

app.delete('/api/projects/:id', requireDB, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Root Health Check
app.get('/', (req, res) => {
    res.json({ status: 'live', message: 'Portfolio Master CMS Backend Running' });
});

// Local Development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;