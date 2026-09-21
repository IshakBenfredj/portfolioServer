const Portfolio = require('../models/portfolio.js');
const uploadImage = require('../uploadImage.js');
const cloudinary = uploadImage.cloudinary || require('cloudinary').v2;

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const addProject = async (req, res) => {
    try {
        const { title, link, type, details, image } = req.body;
        const url = await uploadImage(image);
        const portfolio = await Portfolio.create({ title, link,details, type, image: url });
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const incViews = async (req, res) => {
    try {
        const { id } = req.params;
        const project =  await Portfolio.findById(id)
        project.views += 1
        await project.save()
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the image URL from the database
        const portfolioItem = await Portfolio.findById(id);
        const imageUrl = portfolioItem?.image;

        // Delete the document from MongoDB
        await Portfolio.findByIdAndDelete(id);

        // Delete the image from Cloudinary
        if (imageUrl) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        res.status(201).json({ message: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, link, type, details, image } = req.body;

        let updateData = { title, link, type, details };

        if (image && image.startsWith('data:image')) {
            const url = await uploadImage(image);
            updateData.image = url;
        } else if (image) {
            updateData.image = image;
        }

        const updated = await Portfolio.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'problem' });
    }
};

module.exports = {
    getPortfolio,
    addProject,
    incViews,
    deleteProject,
    updateProject,
};