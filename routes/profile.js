const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// ১. Vercel-এর জন্য মেমোরি স্টোরেজ (লোকাল ড্রাইভে কোনো ফাইল লিখবে না)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// ২. Mongoose প্রোফাইল স্কিমা
const ProfileSchema = new mongoose.Schema({
    // Branding
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

    // About & Bio
    aboutBio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resumeFile: { type: String, default: '' },

    // Dynamic Arrays
    funfacts: [{
        number: { type: String },
        label: { type: String },
        icon: { type: String }
    }],
    services: [{
        title: { type: String },
        icon: { type: String },
        desc: { type: String }
    }],
    technologies: [{
        name: { type: String },
        logo: { type: String }
    }],
    skills: [{
        name: { type: String },
        percentage: { type: Number }
    }],
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

    // Contact Info & Socials
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

// JSON পার্সিং হেল্পার
const parseData = (val, fallback = []) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try {
        return JSON.parse(val);
    } catch (e) {
        return fallback;
    }
};

// ==========================================
// রাউটস (/api/profile)
// ==========================================

// GET: প্রোফাইল ডেটা লোড
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({});
        }
        res.status(200).json(profile);
    } catch (err) {
        console.error('Fetch profile error:', err);
        res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
});

// POST: ড্যাশবোর্ডের FormData সেভ করা (upload.any() দিয়ে)
router.post('/', upload.any(), async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = new Profile();
        }

        const data = req.body || {};

        // ১. ব্র্যান্ডিং
        if (data.siteLogo !== undefined) profile.siteLogo = data.siteLogo;
        if (data.siteFavicon !== undefined) profile.siteFavicon = data.siteFavicon;
        if (data.dashboardAvatar !== undefined) profile.dashboardAvatar = data.dashboardAvatar;
        if (data.projectCategories) profile.projectCategories = parseData(data.projectCategories, profile.projectCategories);

        // ২. হিরো সেকশন
        if (data.badgeText !== undefined) profile.badgeText = data.badgeText;
        if (data.name !== undefined) profile.name = data.name;
        if (data.typingTitles !== undefined) profile.typingTitles = data.typingTitles;
        if (data.heroTagline !== undefined) profile.heroTagline = data.heroTagline;
        if (data.btnSayHelloLink !== undefined) profile.btnSayHelloLink = data.btnSayHelloLink;
        if (data.btnPortfolioLink !== undefined) profile.btnPortfolioLink = data.btnPortfolioLink;

        // ৩. অ্যাবাউট ও বায়ো
        if (data.aboutBio !== undefined) profile.aboutBio = data.aboutBio;

        // ৪. ফাইল আপলোড হ্যান্ডলিং (Base64 কনভার্সন - লোকাল ড্রাইভ লাগবে না)
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                if (file.fieldname === 'profileImage') {
                    profile.profileImage = base64;
                } else if (file.fieldname === 'resumeFile') {
                    profile.resumeFile = base64;
                }
            });
        }
        if (data.profileImage && typeof data.profileImage === 'string' && !profile.profileImage) {
            profile.profileImage = data.profileImage;
        }
        if (data.resumeFile && typeof data.resumeFile === 'string' && !profile.resumeFile) {
            profile.resumeFile = data.resumeFile;
        }

        // ৫. ডাইনামিক অ্যারে
        if (data.funfacts) profile.funfacts = parseData(data.funfacts, profile.funfacts);
        if (data.services) profile.services = parseData(data.services, profile.services);
        if (data.technologies) profile.technologies = parseData(data.technologies, profile.technologies);
        if (data.skills) profile.skills = parseData(data.skills, profile.skills);
        if (data.education) profile.education = parseData(data.education, profile.education);
        if (data.experience) profile.experience = parseData(data.experience, profile.experience);

        // ৬. কনট্যাক্ট ও সোশ্যালস
        if (data.email !== undefined) profile.email = data.email;
        if (data.phone !== undefined) profile.phone = data.phone;
        if (data.address !== undefined) profile.address = data.address;
        if (data.socialLinks) profile.socialLinks = parseData(data.socialLinks, profile.socialLinks);

        const savedProfile = await profile.save();
        res.status(200).json({
            message: 'Profile saved successfully!',
            profile: savedProfile
        });
    } catch (err) {
        console.error('Save profile error:', err);
        res.status(500).json({ error: 'Failed to save profile', details: err.message });
    }
});

module.exports = router;