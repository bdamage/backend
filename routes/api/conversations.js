const express = require("express");
const router = express.Router();
const conversationsController = require("../../controllers/conversationsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(conversationsController.getAllConversations)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    conversationsController.createNewConversation
  );

router.route("/:id").get(conversationsController.getConversation);

module.exports = router;
