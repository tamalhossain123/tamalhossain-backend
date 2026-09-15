const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

// আপলোড ফোল্ডার কনফিগারেশন
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ১. প্রোফাইল ডাটা পাওয়া
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        name: 'Md. Tamal Hossain',
        typingTitles: ['FRONT-END DEVELOPER', 'WORDPRESS SPECIALIST', 'GRAPHIC DESIGNER', 'UI/UX DESIGNER'],
        email: 'tamalhossain908@gmail.com',
        phone: '+880 1730 048626',
        address: 'Barishal Sadar, Barishal-8200, Bangladesh',
        nationality: 'Bangladeshi',
        aboutBio: 'I am a Front-End Developer and Graphic Designer, creating modern interfaces and visually compelling digital experiences.',
        profileImage: 'assets/img/profile-pic.png',
        skills: [
          { name: 'WordPress', percentage: 95 },
          { name: 'Web Design', percentage: 85 },
          { name: 'Graphic Design', percentage: 100 },
          { name: 'UI/UX Design', percentage: 60 }
        ]
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ২. প্রোফাইল ডাটা ও ছবি আপডেট করা (FormData & File Support)
router.put('/', protect, upload.single('profileImage'), async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    if (req.body.name) profile.name = req.body.name;
    if (req.body.email) profile.email = req.body.email;
    if (req.body.phone) profile.phone = req.body.phone;
    if (req.body.address) profile.address = req.body.address;
    if (req.body.aboutBio) profile.aboutBio = req.body.aboutBio;

    if (req.body.typingTitles) {
      if (typeof req.body.typingTitles === 'string') {
        try {
          profile.typingTitles = JSON.parse(req.body.typingTitles);
        } catch {
          profile.typingTitles = req.body.typingTitles.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else {
        profile.typingTitles = req.body.typingTitles;
      }
    }

    // Skills, Education ও Experience হ্যান্ডলিং
    if (req.body.skills) {
      profile.skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills;
    }
    if (req.body.education) {
      profile.education = typeof req.body.education === 'string' ? JSON.parse(req.body.education) : req.body.education;
    }
    if (req.body.experience) {
      profile.experience = typeof req.body.experience === 'string' ? JSON.parse(req.body.experience) : req.body.experience;
    }

    // নতুন ফাইল আপলোড হলে ছবির পাথ আপডেট
    if (req.file) {
      profile.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;