const Message = require('../models/message.js');
const sendMail = require('../nodemailer.js');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(201).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const addMessage = async (req, res) => {
    try {
        const { isWork, name, email, phone, message } = req.body;
        const messageEnvoyer = await Message.create({ isWork, name, email, phone,message });
        sendMail(email,name)
        res.status(201).json(messageEnvoyer);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndDelete(id);
        res.status(201).json({ message: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

module.exports = {
    getMessages,
    addMessage,
    deleteMessage,
};