const Lesson = require('../models/lesson.js');
const uploadImage = require('../uploadImage.js');

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.status(201).json(lessons);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const addLesson = async (req, res) => {
    try {
        const { title, link, image } = req.body;
        const url = await uploadImage(image);
        const lesson = await Lesson.create({ title, link, image: url });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const incViews = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson =  await Lesson.findById(id)
        lesson.views += 1
        await lesson.save()
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the image URL from the database
        const lessonItem = await Lesson.findById(id);
        const imageUrl = lessonItem.image;

        // Delete the document from MongoDB
        await Lesson.findByIdAndDelete(id);

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

module.exports = {
    getLessons,
    addLesson,
    incViews,
    deleteLesson,
};