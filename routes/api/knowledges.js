const express = require("express");
const router = express.Router();
const knowledgeController = require("../../controllers/knowledgeController");
const genaiController = require("../../controllers/genaiController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/generate").post(genaiController.generateKnowledge);

router
  .route("/")
  .get(knowledgeController.getAllKnowledges)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    knowledgeController.createNewKnowledge
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    knowledgeController.updateKnowledge
  );

router
  .route("/:id")
  .get(knowledgeController.getKnowledge)
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    knowledgeController.updateKnowledge
  )
  .delete(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    knowledgeController.deleteKnowledge
  );

module.exports = router;
