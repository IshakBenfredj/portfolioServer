const express = require("express");
const { getLessons, addLesson, deleteLesson, incViews } = require("../controllers/lessons-controller");

const router = express.Router()

router.get('', getLessons)
router.post('/add', addLesson)
router.patch('/incViews/:id', incViews)
router.delete('/delete/:id', deleteLesson)

module.exports = router;