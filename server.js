if (process.env.NODE_ENV !== "production") require('dotenv').config()

const express = require("express")
const TicketController = require("./controllers/ticketController")
const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => res.send('Welcome to parking lot ticket!'))
app.post("/ticket/create", TicketController.createTicket)
app.get("/ticket/getALl", TicketController.getTicket)
if(process.env.NODE_ENV == "test") module.exports = app
else app.listen(port, () => console.log(`listening at port http://localhost:${port}`))
