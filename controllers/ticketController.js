const {Tickets} = require("../models") 
const { Op } = require("sequelize");


class TicketController {
    static createTicket(req,res) {
        const {vehicle_type, time_in, time_out} = req.body
        if(vehicle_type !== "mobil" && vehicle_type!== "motor") return res.status(401).json({message: "unrecognize vehicle type"})
        let total_payment = TicketController.sumTotalPayment(time_out, time_in, vehicle_type)
        Tickets.create({vehicle_type, time_in, time_out, total_payment})
        .then((ticket) => {
            res.status(201).json({message: "ticket successfully created", ticket})
        })
        .catch((err) => res.status(500).json({message: "internal server error", error: err.name}))
    }

    static sumTotalPayment(time_out, time_in, vehicle_type) {
        let totalParkingTime = 0
        let differentTime = new Date(time_out) - new Date(time_in) //find the different time, result in ms
        let minuteTime = (differentTime / 1000) / 60 //find the minutes different, get second (/1000) and get minute (/60)
        let hourTime = Math.ceil(minuteTime / 60) //find the hour different and rounding up the result
        let dayCount = Math.floor(hourTime / 24) //find day count
        let remHour = hourTime % 24 //find remaining hour to count the result later
        let remMinutes = minuteTime % 60 //for compare if < 1 minute then it will not add the bill
        let pricePerDay = 0
        let pricePerHour = 0
        //define price per hour and per day
        if (vehicle_type == "mobil") {
            pricePerHour = 5000
            pricePerDay = 80000
        } else if (vehicle_type == "motor") {
            pricePerHour = 2000
            pricePerDay = 40000
        }
        let limitHourPerDay = pricePerDay / pricePerHour //check limit hour per day
        if(hourTime == 0) totalParkingTime += pricePerHour
        if (dayCount > 0) totalParkingTime += dayCount * pricePerDay
        if (remHour < limitHourPerDay) totalParkingTime += remHour * pricePerHour
        else if (remHour >= limitHourPerDay) totalParkingTime += pricePerDay
        if(remMinutes < 1 && remMinutes > 0) totalParkingTime -= pricePerHour
        return totalParkingTime
    }

    static getTicket(req,res) {
        const {vehicle_type, from_date, to_date, low_price, high_price} = req.query
        let filter = {}
        if(vehicle_type) filter.vehicle_type = vehicle_type == "mobil"? "mobil": "motor"
        if(from_date) filter.createdAt = {[Op.gte]: from_date}
        if(to_date) filter.createdAt = {[Op.lte]: to_date}
        if(low_price) filter.total_payment = {[Op.gte]: low_price}
        if(high_price) filter.total_payment = {[Op.lte]: high_price}
        
        Tickets.findAll({where: filter})
        .then((tickets) => {
            if(!tickets) res.status(200).json({message: "there are no data to fetch"})
            else res.status(200).json({message: "here's your data", tickets})
        })
        .catch((err) => res.status(500).json({message: "internal server error"}))
    }
}

module.exports = TicketController