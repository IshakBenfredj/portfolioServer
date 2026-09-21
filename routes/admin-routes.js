const express = require("express");
const { adminLogin, getAdminStats } = require("../controllers/admin-controller");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", getAdminStats);

module.exports = router;
