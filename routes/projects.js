const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // অথবা আপনার মডেলের সঠিক পাথ

// @route   GET /api/projects
// @desc    Get all portfolio projects
router.get('/', async (req, res) => {
    try {
        // ডাটাবেস থেকে সব প্রজেক্ট নিয়ে আসা
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err.message);
        res.status(500).json({ msg: 'Server error while fetching projects' });
    }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/projects
// @desc    Add new project
router.post('/', async (req, res) => {
    try {
        const { title, category, description, image, liveUrl } = req.body;
        const newProject = new Project({
            title,
            category,
            description,
            image,
            liveUrl
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        await project.deleteOne();
        res.json({ msg: 'Project removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;