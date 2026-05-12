const express = require("express");
const {
  createTicket,
  getBusinessTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket
} = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", createTicket);
router.get("/business", authMiddleware, getBusinessTickets);
router.get("/:id", authMiddleware, getTicketById);
router.put("/update-status/:id", authMiddleware, updateTicketStatus);
router.delete("/delete/:id", authMiddleware, deleteTicket);

module.exports = router;
