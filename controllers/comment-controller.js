const Comment = require('../models/comment');

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(201).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const addComment = async (req, res) => {
    try {
        const { name, email, comment } = req.body;
        const commentEnvoyer = await Comment.create({ name, email, comment });
        res.status(201).json(commentEnvoyer);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.status(201).json({ message: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment,
};