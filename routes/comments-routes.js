const express = require("express");
const { getComments, addComment, deleteComment } = require("../controllers/comment-controller");

const router = express.Router()

router.get('', getComments)
router.post('/add', addComment)
router.delete('/delete/:id', deleteComment)

module.exports = router;