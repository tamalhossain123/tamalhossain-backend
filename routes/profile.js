const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// ১. Vercel Serverless-এর জন্য Memory Storage (নো ডিস্ক রাইট)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resumeFile') {
        if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for resume!'), false);
        }
    } else {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for profile picture!'), false);
        }
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Vercel payload limit compliant (5MB)
    fileFilter: fileFilter
});

// ২. Mongoose প্রোফাইল স্কিমা
const ProfileSchema = new mongoose.Schema({
    // Branding & Logos
    siteLogo: { type: String, default: '' },
    siteFavicon: { type: String, default: '' },
    dashboardAvatar: { type: String, default: '' },
    projectCategories: { 
        type: [String], 
        default: ['website', 'wordpress', 'graphic', 'photoshop', 'uiux'] 
    },

    // Hero Section
    badgeText: { type: String, default: '- I AM MD. TAMAL HOSSAIN' },
    name: { type: String, default: 'Md. Tamal Hossain' },
    typingTitles: { type: String, default: 'Front-End Developer, WordPress Specialist, Graphic Designer, UI/UX Designer' },
    heroTagline: { type: String, default: 'Crafting high-performance, modern web interfaces and scalable WordPress solutions.' },
    btnSayHelloLink: { type: String, default: '#contact' },
    btnPortfolioLink: { type: String, default: '#portfolio' },

    // About & Files
    aboutBio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resumeFile: { type: String, default: '' },

    // Funfacts Counter
    funfacts: [{
        number: { type: String },
        label: { type: String },
        icon: { type: String }
    }],

    // Services
    services: [{
        title: { type: String },
        icon: { type: String },
        desc: { type: String }
    }],

    // Technologies Logos
    technologies: [{
        name: { type: String },
        logo: { type: String }
    }],

    // Skills
    skills: [{
        name: { type: String },
        percentage: { type: Number }
    }],

    // Timeline
    education: [{
        degree: { type: String },
        institute: { type: String },
        year: { type: String }
    }],
    experience: [{
        role: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String }
    }],

    // Contact & Social Channels
    email: { type: String, default: 'tamalhossain908@gmail.com' },
    phone: { type: String, default: '+880 1730048626' },
    address: { type: String, default: 'Middle Badda, Dhaka-1212, Bangladesh' },
    socialLinks: [{
        name: { type: String },
        icon: { type: String },
        url: { type: String }
    }]
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

// হেল্পার: সেইফ JSON পার্সিং
const safeJsonParse = (data, fallback = []) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data;
    try {
        return JSON.parse(data);
    } catch (e) {
        return fallback;
    }
};

// GET /api/profile
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({});
        }
        res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
});

// POST /api/profile
router.post('/', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 }
]), async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = new Profile();
        }

        const body = req.body;

        // Branding
        if (body.siteLogo !== undefined) profile.siteLogo = body.siteLogo;
        if (body.siteFavicon !== undefined) profile.siteFavicon = body.siteFavicon;
        if (body.dashboardAvatar !== undefined) profile.dashboardAvatar = body.dashboardAvatar;
        if (body.projectCategories) profile.projectCategories = safeJsonParse(body.projectCategories, profile.projectCategories);

        // Hero
        if (body.badgeText !== undefined) profile.badgeText = body.badgeText;
        if (body.name !== undefined) profile.name = body.name;
        if (body.typingTitles !== undefined) profile.typingTitles = body.typingTitles;
        if (body.heroTagline !== undefined) profile.heroTagline = body.heroTagline;
        if (body.btnSayHelloLink !== undefined) profile.btnSayHelloLink = body.btnSayHelloLink;
        if (body.btnPortfolioLink !== undefined) profile.btnPortfolioLink = body.btnPortfolioLink;

        // About & Bio
        if (body.aboutBio !== undefined) profile.aboutBio = body.aboutBio;

        // File Uploads (Vercel-Safe Base64 Conversion)
        if (req.files) {
            if (req.files.profileImage && req.files.profileImage[0]) {
                const img = req.files.profileImage[0];
                profile.profileImage = `data:${img.mimetype};base64,${img.buffer.toString('base64')}`;
            }
            if (req.files.resumeFile && req.files.resumeFile[0]) {
                const doc = req.files.resumeFile[0];
                profile.resumeFile = `data:${doc.mimetype};base64,${doc.buffer.toString('base64')}`;
            }
        }

        // Dynamic Lists / Arrays
        if (body.funfacts) profile.funfacts = safeJsonParse(body.funfacts, profile.funfacts);
        if (body.services) profile.services = safeJsonParse(body.services, profile.services);
        if (body.technologies) profile.technologies = safeJsonParse(body.technologies, profile.technologies);
        if (body.skills) profile.skills = safeJsonParse(body.skills, profile.skills);
        if (body.education) profile.education = safeJsonParse(body.education, profile.education);
        if (body.experience) profile.experience = safeJsonParse(body.experience, profile.experience);

        // Contact Info & Socials
        if (body.email !== undefined) profile.email = body.email;
        if (body.phone !== undefined) profile.phone = body.phone;
        if (body.address !== undefined) profile.address = body.address;
        if (body.socialLinks) profile.socialLinks = safeJsonParse(body.socialLinks, profile.socialLinks);

        const updatedProfile = await profile.save();
        res.status(200).json({
            message: 'Profile saved successfully!',
            profile: updatedProfile
        });
    } catch (err) {
        console.error('Error saving profile:', err);
        res.status(500).json({ error: 'Failed to save profile', details: err.message });
    }
});

module.exports = router;