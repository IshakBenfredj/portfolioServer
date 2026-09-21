const express = require("express");
const { getServices, addService, deleteService, getServiceById, updateService } = require("../controllers/service-controller");

const router = express.Router()

router.get('', getServices)
router.get('/:id', getServiceById)
router.post('/add', addService)
router.put('/update/:id', updateService)
router.patch('/update/:id', updateService)
router.delete('/delete/:id', deleteService)

module.exports = router;