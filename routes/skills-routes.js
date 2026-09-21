const express = require("express");
const {
  addSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require("../controllers/skills-controller.js");

const router = express.Router();

router.get("", getSkills);
router.get("/:id", getSkillById);
router.post("/add", addSkill);
router.put("/edit/:id", updateSkill);
router.put("/:id", updateSkill);
router.delete("/delete/:id", deleteSkill);

module.exports = router;