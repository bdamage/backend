const express = require("express");
const router = express.Router();
const eventsController = require("../../controllers/eventsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/").get(
  /*   verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),*/
  eventsController.handleEvents
);

module.exports = router;
