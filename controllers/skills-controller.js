const Skill = require('../models/skill.js');
const uploadImage = require('../uploadImage.js');
const cloudinary = uploadImage.cloudinary || require('cloudinary').v2;

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const getSkillById = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findById(id);
        if (!skill) return res.status(404).json({ error: "Skill not found" });
        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const addSkill = async (req, res) => {
    try {
        const { name, type, image } = req.body;
        const url = await uploadImage(image);
        const skill = await Skill.create({
            name,
            type: Array.isArray(type) ? type : [type],
            image: url,
        });
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, image } = req.body;
        let updateData = {
            name,
            type: Array.isArray(type) ? type : [type],
        };

        if (image) {
            if (typeof image === "string" && (image.startsWith("data:") || image.startsWith("blob:"))) {
                const url = await uploadImage(image);
                updateData.image = url;
            } else {
                updateData.image = image;
            }
        }

        const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedSkill) return res.status(404).json({ error: "Skill not found" });
        res.status(200).json(updatedSkill);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const skillItem = await Skill.findById(id);
        if (!skillItem) return res.status(404).json({ error: "Skill not found" });
        const imageUrl = skillItem.image;

        await Skill.findByIdAndDelete(id);

        if (imageUrl && typeof imageUrl === "string" && imageUrl.includes("cloudinary")) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        res.status(200).json({ message: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

module.exports = {
    getSkills,
    getSkillById,
    addSkill,
    updateSkill,
    deleteSkill,
};

