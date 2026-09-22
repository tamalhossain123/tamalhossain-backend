const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// ইনিশিয়াল প্রজেক্ট সিড ডেটা (ডাটাবেজ খালি থাকলেও পোর্টফোলিও লাইভ ও সুন্দর দেখাবে)
const initialSeedProjects = [
    {
        title: 'MARBLE Agency Landing Page',
        category: 'website',
        actionType: 'url',
        scrollMode: 'scroll',
        description: 'Responsive web interface for digital agency',
        image: 'assets/img/portfolio/website/1.jpg',
        liveUrl: 'https://tamalhossain123.github.io/MARBLE/'
    },
    {
        title: 'Skylar Larkyn Consulting',
        category: 'wordpress',
        actionType: 'url',
        scrollMode: 'scroll',
        description: 'Business Consulting Portfolio Website',
        image: 'assets/img/portfolio/wordpress/1.png',
        liveUrl: 'https://skylarlarkyn.com/'
    },
    {
        title: 'Social Media Poster',
        category: 'photoshop',
        actionType: 'lightbox',
        scrollMode: 'fit',
        description: 'Created for clothing brand Shoily...',
        image: 'assets/img/portfolio/photoshop/1.jpg',
        liveUrl: ''
    },
    {
        title: 'Logo Design',
        category: 'illustrator',
        actionType: 'lightbox',
        scrollMode: 'fit',
        description: 'Minimalist vector logo for Shoily...',
        image: 'assets/img/portfolio/illustrator/5.jpg',
        liveUrl: ''
    }
];

// ==========================================================================
// @route   GET /api/projects
// @desc    সব প্রজেক্ট ফেচ করা (খালি থাকলে ইনিশিয়াল সিড প্রজেক্ট দিয়ে পূরণ করবে)
// ==========================================================================
router.get('/', async (req, res) => {
    try {
        let projects = await Project.find().sort({ createdAt: -1 });

        // ডাটাবেজ খালি থাকলে স্বয়ংক্রিয়ভাবে ৪টি ইনিশিয়াল প্রজেক্ট তৈরি করবে
        if (!projects || projects.length === 0) {
            projects = await Project.insertMany(initialSeedProjects);
        }

        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err.message);
        res.status(500).json({ error: 'Server error while fetching projects', details: err.message });
    }
});

// ==========================================================================
// @route   GET /api/projects/:id
// @desc    নির্দিষ্ট প্রজেক্ট আইডি দিয়ে ফেচ করা
// ==========================================================================
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.status(200).json(project);
    } catch (err) {
        console.error('Fetch project by ID error:', err.message);
        res.status(500).json({ error: 'Server error fetching project', details: err.message });
    }
});

// ==========================================================================
// @route   POST /api/projects
// @desc    নতুন প্রজেক্ট যোগ করা (actionType ও scrollMode সহ)
// ==========================================================================
router.post('/', async (req, res) => {
    try {
        const { 
            title, 
            category, 
            actionType, 
            scrollMode, 
            description, 
            image, 
            liveUrl 
        } = req.body;

        if (!title || !category || !image) {
            return res.status(400).json({ error: 'Title, category, and image are required' });
        }

        const newProject = new Project({
            title: title.trim(),
            category: category.trim().toLowerCase(),
            actionType: actionType || 'url',
            scrollMode: scrollMode || 'fit',
            description: (description || '').trim(),
            image: image, // Base64 বা ইমেজ URL
            liveUrl: (liveUrl || '').trim()
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        console.error('Create project error:', err.message);
        res.status(500).json({ error: 'Server error creating project', details: err.message });
    }
});

// ==========================================================================
// @route   DELETE /api/projects/:id
// @desc    প্রজেক্ট ডিলিট করা
// ==========================================================================
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        await project.deleteOne();
        res.status(200).json({ message: 'Project removed successfully', id: req.params.id });
    } catch (err) {
        console.error('Delete project error:', err.message);
        res.status(500).json({ error: 'Server error deleting project', details: err.message });
    }
});

module.exports = router;