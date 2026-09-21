const express = require("express");
const { getPortfolio, addProject, deleteProject, incViews, updateProject } = require("../controllers/portfolio-controller");

const router = express.Router()

router.get('', getPortfolio)
router.post('/add', addProject)
router.put('/update/:id', updateProject)
router.patch('/update/:id', updateProject)
router.patch('/incViews/:id', incViews)
router.delete('/delete/:id', deleteProject)

module.exports = router;