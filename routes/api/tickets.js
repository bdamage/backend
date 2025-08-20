const express = require("express");
const router = express.Router();
const ticketsController = require("../../controllers/ticketsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(ticketsController.getAllTickets)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    ticketsController.createNewTicket
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    ticketsController.updateTicket
  );

router
  .route("/:id")
  .get(ticketsController.getTicket)
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    ticketsController.updateTicket
  )
  .delete(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    ticketsController.deleteTicket
  );

router.route("/similar/:id").get(ticketsController.similarTickets);
router.route("/related/:id").get(ticketsController.relatedArticle);

module.exports = router;
