const express = require("express");
const { getLessons, getLessonById, addLesson, deleteLesson, incViews } = require("../controllers/lessons-controller");

const router = express.Router();

router.get('/', getLessons);
router.get('/:id', getLessonById);
router.post('/add', addLesson);
router.patch('/incViews/:id', incViews);
router.delete('/delete/:id', deleteLesson);

module.exports = router;