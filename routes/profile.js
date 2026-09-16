const express = require('express');
const router = express.Router();
const multer = require('multer');

// মডেল ও মিডলওয়্যার নিরাপদে লোড করা
let Profile;
try { Profile = require('../models/Profile'); } catch (e) { Profile = require('../models/profile'); }

let auth;
try { auth = require('../middleware/auth'); } catch (e) { auth = (req, res, next) => next(); }

// Vercel Serverless-এর জন্য MemoryStorage (ফাইল ডিস্কে সেভ না হয়ে মেমোরিতে প্রসেস হবে)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // সর্বোচ্চ ৫ এমবি
});

// @route   GET /api/profile
// @desc    Get current profile info
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            return res.json({});
        }
        res.json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ msg: 'Server error while fetching profile' });
    }
});

// প্রোফাইল সেভ করার কমন ফাংশন (POST ও PUT উভয়ের জন্য)
const saveProfileHandler = async (req, res) => {
    try {
        const { name, email, phone, address, typingTitles, aboutBio, skills, education, experience } = req.body;

        const profileFields = {};
        if (name !== undefined) profileFields.name = name;
        if (email !== undefined) profileFields.email = email;
        if (phone !== undefined) profileFields.phone = phone;
        if (address !== undefined) profileFields.address = address;
        if (aboutBio !== undefined) profileFields.aboutBio = aboutBio;
        if (typingTitles !== undefined) profileFields.typingTitles = typingTitles;

        // অ্যারে ফিল্ডগুলো থাকলে সেভ করা
        if (skills) {
            try { profileFields.skills = typeof skills === 'string' ? JSON.parse(skills) : skills; } catch (e) { profileFields.skills = skills; }
        }
        if (education) {
            try { profileFields.education = typeof education === 'string' ? JSON.parse(education) : education; } catch (e) { profileFields.education = education; }
        }
        if (experience) {
            try { profileFields.experience = typeof experience === 'string' ? JSON.parse(experience) : experience; } catch (e) { profileFields.experience = experience; }
        }

        // ছবি আপলোড হলে Base64 স্ট্রিং আকারে সরাসরি ডাটাবেসে সেভ হবে (Vercel-এ কোনো সমস্যা হবে না)
        if (req.file) {
            profileFields.profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        // ডাটাবেসে প্রোফাইল আপডেট বা নতুন তৈরি (upsert: true)
        let profile = await Profile.findOneAndUpdate(
            {},
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);
    } catch (err) {
        console.error('Error saving profile:', err);
        res.status(500).json({ msg: 'Server error while saving profile', error: err.message });
    }
};

// POST এবং PUT দুটো রুটেই সেভ করার সুবিধা
router.post('/', upload.single('profileImage'), saveProfileHandler);
router.put('/', upload.single('profileImage'), saveProfileHandler);

module.exports = router;