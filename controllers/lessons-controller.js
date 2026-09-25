const Lesson = require('../models/lesson.js');
const uploadImage = require('../uploadImage.js');
const cloudinary = require('cloudinary').v2;

const getLessons = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = { isPublished: { $ne: false } };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { titleAr: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const lessons = await Lesson.find(query).sort({ createdAt: -1 });
        res.status(200).json(lessons);
    } catch (error) {
        console.error('getLessons error:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
};

const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        let lesson = null;

        // Try find by ID if valid ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            lesson = await Lesson.findById(id);
        }

        // If not found by ID, try finding by slug
        if (!lesson) {
            lesson = await Lesson.findOne({ slug: id });
        }

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Increment views automatically
        lesson.views = (lesson.views || 0) + 1;
        await lesson.save();

        res.status(200).json(lesson);
    } catch (error) {
        console.error('getLessonById error:', error);
        res.status(500).json({ error: 'Failed to fetch lesson' });
    }
};

const addLesson = async (req, res) => {
    try {
        const {
            title,
            titleAr,
            titleFr,
            slug,
            summary,
            summaryAr,
            summaryFr,
            content,
            contentAr,
            contentFr,
            category,
            categoryAr,
            categoryFr,
            tags,
            readTime,
            link,
            image,
            isFeatured,
        } = req.body;

        let imageUrl = image;
        if (image && image.startsWith('data:image')) {
            imageUrl = await uploadImage(image);
        }

        const generatedSlug =
            slug ||
            title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

        const lesson = await Lesson.create({
            title,
            titleAr,
            titleFr,
            slug: generatedSlug,
            summary,
            summaryAr,
            summaryFr,
            content,
            contentAr,
            contentFr,
            category: category || 'Full-Stack Web',
            categoryAr,
            categoryFr,
            tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
            readTime: (link && (link.startsWith('http://') || link.startsWith('https://'))) ? (readTime || '') : (readTime || '5 min'),
            link: link || '',
            image: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
            isFeatured: isFeatured || false,
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error('addLesson error:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
};

const incViews = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        lesson.views = (lesson.views || 0) + 1;
        await lesson.save();
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ error: 'Problem updating views' });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lessonItem = await Lesson.findById(id);
        if (!lessonItem) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const imageUrl = lessonItem.image;
        await Lesson.findByIdAndDelete(id);

        if (imageUrl && imageUrl.includes('cloudinary')) {
            try {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cErr) {
                console.warn('Cloudinary deletion warning:', cErr);
            }
        }

        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Problem deleting lesson' });
    }
};

module.exports = {
    getLessons,
    getLessonById,
    addLesson,
    incViews,
    deleteLesson,
};