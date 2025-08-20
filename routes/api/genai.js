const express = require("express");
const router = express.Router();
const genaiController = require("../../controllers/genaiController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/generate").get(genaiController.generateKnowledge);
router.route("/").get(genaiController.genAiLabz);

module.exports = router;
