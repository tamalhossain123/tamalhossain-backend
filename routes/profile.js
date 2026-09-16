const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// Vercel-Safe Memory Storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

// ইনিশিয়াল প্লেসহোল্ডার ডেটা (যাতে সাইট কখনো ফাঁকা না দেখায়)
const defaultProfile = {
    siteLogo: 'assets/img/logo.png',
    siteFavicon: 'assets/img/favicon.ico',
    dashboardAvatar: 'assets/img/profile-pic.png',
    projectCategories: ['website', 'wordpress', 'photoshop', 'illustrator'],

    badgeText: "- I Am Md. Tamal Hossain",
    name: 'Md. Tamal Hossain',
    typingTitles: 'Front-End Developer, WordPress Specialist, UI/UX Designer, Graphic Designer',
    heroTagline: 'Crafting high-performance, modern web interfaces and intuitive digital experiences with a clean, user-centric design approach.',
    btnSayHelloLink: '#contact',
    btnPortfolioLink: '#portfolio',

    aboutBio: 'I am a passionate Front-End Developer and Creative Designer dedicated to building high-performance, accessible, and visually compelling web applications. With expertise spanning modern JavaScript frameworks, custom WordPress architectures, and intuitive UI/UX design, I bridge the gap between creative visual concepts and robust code.',
    profileImage: 'assets/img/profile-pic.png',
    resumeFile: '#',

    funfacts: [
        { number: '90', label: 'Happy Clients', icon: 'fa-solid fa-users' },
        { number: '110', label: 'Successful Projects', icon: 'fa-solid fa-award' },
        { number: '7', label: 'Web Projects', icon: 'fa-solid fa-laptop-code' },
        { number: '120', label: 'Graphic & UI Projects', icon: 'fa-solid fa-palette' }
    ],

    services: [
        { title: 'Web Design', icon: 'ti-world', desc: 'Designing modern, responsive websites with user-friendly interfaces, clean layouts, and engaging digital experiences.' },
        { title: 'WordPress Development', icon: 'ti-wordpress', desc: 'Building responsive, customizable WordPress websites with clean structure, WooCommerce setup, and seamless UX.' },
        { title: 'Graphic & UI Design', icon: 'ti-write', desc: 'Creating visually compelling graphics and intuitive UI designs that enhance user experience and brand identity.' }
    ],

    technologies: [
        { name: 'Bootstrap', logo: './assets/img/Technologies/bootstrap.png' },
        { name: 'HTML5', logo: './assets/img/Technologies/html.png' },
        { name: 'CSS3', logo: './assets/img/Technologies/css.png' },
        { name: 'JavaScript', logo: './assets/img/Technologies/JavaScript-Logo.png' },
        { name: 'Figma', logo: './assets/img/Technologies/figma.png' },
        { name: 'Adobe XD', logo: './assets/img/Technologies/xd.png' },
        { name: 'Adobe Photoshop', logo: './assets/img/Technologies/photoshop-01.png' },
        { name: 'Adobe Illustrator', logo: './assets/img/Technologies/illustrator.png' },
        { name: 'WordPress', logo: './assets/img/Technologies/wordpress-01.png' },
        { name: 'Elementor', logo: './assets/img/Technologies/elementor.png' }
    ],

    skills: [
        { name: 'Photoshop', percentage: 95 },
        { name: 'WordPress Development', percentage: 90 },
        { name: 'Front-End (HTML / CSS / JS)', percentage: 85 },
        { name: 'UI / UX Design', percentage: 80 },
        { name: 'Adobe Illustrator', percentage: 100 }
    ],

    education: [
        { degree: 'Web Design & Development', institute: 'UY Lab', year: '2025' },
        { degree: 'Diploma in Engineering', institute: 'Bhola Polytechnic Institute', year: '2023' },
        { degree: 'Secondary School Certificate', institute: 'Barishal Technical School & College', year: '2019' }
    ],
    experience: [
        { role: 'IT Consultant', company: 'Elevex Mart International', duration: '2025 - Present', description: 'Managing end-to-end website optimization, adding features, bug fixing, and designing high-impact visual mockups and marketing assets.' },
        { role: 'IT Consultant & Designer', company: 'Sunny Travels and Tour Ltd.', duration: '2024 - 2025', description: 'Created corporate branding, designed promotional brochures, social media marketing content, and executed travel campaigns.' },
        { role: 'Sales Engineer', company: 'Suntech HVAC Engineering Ltd.', duration: '2023 - 2024', description: 'Managed key client relationships, drafted technical HVAC proposals, prepared cost estimations, and negotiated contracts.' }
    ],

    email: 'tamalhossain908@gmail.com',
    phone: '+880 1730 048626',
    address: 'Barishal Sadar, Barishal-8200, Bangladesh',
    socialLinks: [
        { name: 'GitHub', icon: 'fa-brands fa-github', url: 'https://github.com/tamalhossain123' },
        { name: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', url: 'https://www.linkedin.com/in/iamtamal1' },
        { name: 'Upwork', icon: 'fa-brands fa-upwork', url: 'https://www.upwork.com/freelancers/~01a10fab5dc1d5b765' },
        { name: 'Twitter', icon: 'fa-brands fa-x-twitter', url: 'https://x.com/tamalhossain123' },
        { name: 'Facebook', icon: 'fa-brands fa-facebook-f', url: 'https://www.facebook.com/iamtamal1' },
        { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', url: 'https://wa.me/qr/A4ODBWOWFBRPF1' }
    ]
};

// Mongoose Schema
const ProfileSchema = new mongoose.Schema({
    siteLogo: { type: String, default: defaultProfile.siteLogo },
    siteFavicon: { type: String, default: defaultProfile.siteFavicon },
    dashboardAvatar: { type: String, default: defaultProfile.dashboardAvatar },
    projectCategories: { type: [String], default: defaultProfile.projectCategories },

    badgeText: { type: String, default: defaultProfile.badgeText },
    name: { type: String, default: defaultProfile.name },
    typingTitles: { type: String, default: defaultProfile.typingTitles },
    heroTagline: { type: String, default: defaultProfile.heroTagline },
    btnSayHelloLink: { type: String, default: defaultProfile.btnSayHelloLink },
    btnPortfolioLink: { type: String, default: defaultProfile.btnPortfolioLink },

    aboutBio: { type: String, default: defaultProfile.aboutBio },
    profileImage: { type: String, default: defaultProfile.profileImage },
    resumeFile: { type: String, default: defaultProfile.resumeFile },

    funfacts: [{ number: String, label: String, icon: String }],
    services: [{ title: String, icon: String, desc: String }],
    technologies: [{ name: String, logo: String }],
    skills: [{ name: String, percentage: Number }],
    education: [{ degree: String, institute: String, year: String }],
    experience: [{ role: String, company: String, duration: String, description: String }],

    email: { type: String, default: defaultProfile.email },
    phone: { type: String, default: defaultProfile.phone },
    address: { type: String, default: defaultProfile.address },
    socialLinks: [{ name: String, icon: String, url: String }]
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

const parseData = (val, fallback = []) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch (e) { return fallback; }
};

// GET: লোড প্রোফাইল (না থাকলে ডিফল্ট ক্রিয়েট হবে)
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create(defaultProfile);
        }
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
});

// POST: ড্যাশবোর্ড সেভ
router.post('/', upload.any(), async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) profile = new Profile();

        const data = req.body || {};

        if (data.siteLogo !== undefined) profile.siteLogo = data.siteLogo;
        if (data.siteFavicon !== undefined) profile.siteFavicon = data.siteFavicon;
        if (data.dashboardAvatar !== undefined) profile.dashboardAvatar = data.dashboardAvatar;
        if (data.projectCategories) profile.projectCategories = parseData(data.projectCategories, profile.projectCategories);

        if (data.badgeText !== undefined) profile.badgeText = data.badgeText;
        if (data.name !== undefined) profile.name = data.name;
        if (data.typingTitles !== undefined) profile.typingTitles = data.typingTitles;
        if (data.heroTagline !== undefined) profile.heroTagline = data.heroTagline;
        if (data.btnSayHelloLink !== undefined) profile.btnSayHelloLink = data.btnSayHelloLink;
        if (data.btnPortfolioLink !== undefined) profile.btnPortfolioLink = data.btnPortfolioLink;

        if (data.aboutBio !== undefined) profile.aboutBio = data.aboutBio;

        // Base64 ফাইল কনভার্সন
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const b64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                if (file.fieldname === 'profileImage') profile.profileImage = b64;
                if (file.fieldname === 'resumeFile') profile.resumeFile = b64;
            });
        }
        if (data.profileImage && typeof data.profileImage === 'string' && !profile.profileImage) {
            profile.profileImage = data.profileImage;
        }
        if (data.resumeFile && typeof data.resumeFile === 'string' && !profile.resumeFile) {
            profile.resumeFile = data.resumeFile;
        }

        if (data.funfacts) profile.funfacts = parseData(data.funfacts, profile.funfacts);
        if (data.services) profile.services = parseData(data.services, profile.services);
        if (data.technologies) profile.technologies = parseData(data.technologies, profile.technologies);
        if (data.skills) profile.skills = parseData(data.skills, profile.skills);
        if (data.education) profile.education = parseData(data.education, profile.education);
        if (data.experience) profile.experience = parseData(data.experience, profile.experience);

        if (data.email !== undefined) profile.email = data.email;
        if (data.phone !== undefined) profile.phone = data.phone;
        if (data.address !== undefined) profile.address = data.address;
        if (data.socialLinks) profile.socialLinks = parseData(data.socialLinks, profile.socialLinks);

        const savedProfile = await profile.save();
        res.status(200).json({ message: 'Saved successfully', profile: savedProfile });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save', details: err.message });
    }
});

module.exports = router;