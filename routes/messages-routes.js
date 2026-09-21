const express = require("express");
const { getMessages, addMessage, deleteMessage } = require("../controllers/message-controller.js");

const router = express.Router()

router.get('', getMessages)
router.post('/add', addMessage)
router.delete('/delete/:id', deleteMessage)

module.exports = router;