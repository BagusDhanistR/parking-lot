const router = require("express").Router
const TicketController = require("../controllers/ticketController")

router.post("tic3kets/create", TicketController.createTicket)
router.get("tickets/getAll", TicketController.getTicket)

module.exports = router