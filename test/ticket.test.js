const request = require('supertest')
const app = require('../server')
const { sequelize } = require('../models')
const { queryInterface } = sequelize

beforeAll((done) => {
  queryInterface
    .bulkDelete("Tickets")
    .then(() => done())
    .catch((err) => done(err))
})

Date.prototype.addDay = function(h){
    this.setDate(this.getDate()+h);
    return this;
}
Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}
Date.prototype.addMinutes = function(h){
    this.setMinutes(this.getMinutes()+h);
    return this;
}
Date.prototype.addSeconds = function(h){
    this.setSeconds(this.getSeconds()+h);
    return this;
}

describe('POST ticket/create', () => {
    it('Success test with valid car inputted, returning message success and ticket data', (done) => {
        request(app).post('/ticket/create')
            .send({
            vehicle_type: "mobil",
            time_out: "2022-12-01T11:22:07.146Z",
            time_in: "2022-11-29T11:22:07.146Z"
            })
            .then(({ body, status }) => {
            expect(status).toBe(201)
            expect(body).toHaveProperty("ticket", expect.any(Object))
            expect(body.message).toContain("ticket successfully created", expect.any(String))
            done()
            })
    })
    it('Success test with valid motorcycle inputted, returning message success and ticket data', (done) => {
        request(app).post('/ticket/create')
            .send({
            vehicle_type: "motor",
            time_out: "2022-12-01T11:22:07.146Z",
            time_in: "2022-11-29T11:22:07.146Z"
            })
            .then(({ body, status }) => {
            expect(status).toBe(201)
            expect(body).toHaveProperty("ticket", expect.any(Object))
            expect(body.message).toContain("ticket successfully created", expect.any(String))
            done()
            })
    })
    it('fail with input with one of undefined input', (done) => {
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "mobil",
                time_out: "",
                time_in: "2022-11-29T11:22:07.146Z"
            })
            .then(({ body, status }) => {
            expect(status).toBe(500)
            expect(body.message).toContain("internal server error")
            expect(body.error).toContain("SequelizeValidationError")
            done()
            })
    })
    it('fail with input with time out less than time in', (done) => {
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "mobil",
                time_out: "2022-11-29T11:22:07.146Z",
                time_in: "2022-12-01T11:22:07.146Z"
            })
            .then(({ body, status }) => {
            expect(status).toBe(500)
            expect(body.message).toContain("internal server error")
            expect(body.error).toContain("SequelizeValidationError")
            done()
            })
    })
    it('fail with unrecognized vehicle type input', (done) => {
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "mobilllll",
                time_out: "2022-11-29T11:22:07.146Z",
                time_in: "2022-11-29T11:22:07.146Z"
            })
            .then(({ body, status }) => {
            expect(status).toBe(401)
            expect(body.message).toContain("unrecognize vehicle type")
            done()
            })
    })
    it('success input 1 hours, 1 minute, and 2 seconds car parking, total_payment must be 10000', (done) => {
        let time_in = new Date()
        let time_out = new Date()
        time_out.addHours(1)
        time_out.addMinutes(1)
        time_out.addSeconds(2)
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "mobil",
                time_out: time_out,
                time_in: time_in
            })
            .then(({ body, status }) => {
            expect(status).toBe(201)
            expect(body.message).toContain("ticket successfully created", expect.any(String))
            expect(body.ticket.total_payment).toEqual(10000, expect.any(Number))
            done()
            })
    })
    it('success input 1 hours, and 56 seconds car parking, total_payment must be 5000', (done) => {
        let time_in = new Date()
        let time_out = new Date()
        time_out.addHours(1)
        time_out.addSeconds(56)
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "mobil",
                time_out: time_out,
                time_in: time_in
            })
            .then(({ body, status }) => {
            expect(status).toBe(201)
            expect(body.message).toContain("ticket successfully created", expect.any(String))
            expect(body.ticket.total_payment).toEqual(5000, expect.any(Number))
            done()
            })
    })
    it('success input 1 day, and 6 hours car parking, total_payment must be 110000', (done) => {
        let time_in = new Date()
        let time_out = new Date()
        time_out.addDay(1)
        time_out.addHours(6)
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "mobil",
                time_out: time_out,
                time_in: time_in
            })
            .then(({ body, status }) => {
            expect(status).toBe(201)
            expect(body.message).toContain("ticket successfully created", expect.any(String))
            expect(body.ticket.total_payment).toEqual(110000, expect.any(Number))
            done()
            })
    })
    it('success input 1 day, and 6 hours motorcycle parking, total_payment must be 52000', (done) => {
        // (1 * 40000) + (6* 2000) = 52000
        let time_in = new Date()
        let time_out = new Date()
        time_out.addDay(1)
        time_out.addHours(6)
        request(app).post('/ticket/create')
            .send({
                vehicle_type: "motor",
                time_out: time_out,
                time_in: time_in
            })
            .then(({ body, status }) => {
            expect(status).toBe(201)
            expect(body.message).toContain("ticket successfully created", expect.any(String))
            expect(body.ticket.total_payment).toEqual(52000, expect.any(Number))
            done()
            })
    })
})

describe('GET ticket/getAll', () => {
    it('Success getting all ticket data', (done) => {
      request(app).get('/ticket/getAll')
        .set({})
        .then(({ body, status }) => {
          expect(status).toBe(200)
          expect(body.tickets).toEqual(expect.any(Array))
          done()
        })
    })
    it('Success getting all ticket data with vehicle type "motor" only', (done) => {
        request(app).get('/ticket/getAll?vehicle_type=motor')
          .set({})
          .then(({ body, status }) => {
            expect(status).toBe(200)
            expect(body.tickets).toEqual(expect.any(Array))
            body.tickets.map(ticket => {
                expect(ticket.vehicle_type).toContain("motor", expect.any(String))
            })
            done()
          })
      })
      it('Success getting all ticket data with vehicle type "mobil" only', (done) => {
        request(app).get('/ticket/getAll?vehicle_type=mobil')
          .set({})
          .then(({ body, status }) => {
            expect(status).toBe(200)
            expect(body.tickets).toEqual(expect.any(Array))
            body.tickets.map(ticket => {
                expect(ticket.vehicle_type).toContain("mobil", expect.any(String))
            })
            done()
          })
      })
      it('Success getting all ticket data from 2 hours ago', (done) => {
        let time = new Date()
        time.addHours(-2)
        request(app).get(`/ticket/getAll?from_date=${time}`)
          .set({})
          .then(({ body, status }) => {
            expect(status).toBe(200)
            expect(body.tickets).toEqual(expect.any(Array))
            body.tickets.map(ticket => {
                //to checkif it greater than 2 hours ago, if it success it \will be false and checked with toBeFalsy()
                expect(ticket.createdAt >= time).toBeTruthy()
            })
            done()
          })
      })
      it('Success getting all ticket data qith price grater than equal 20000', (done) => {
        request(app).get(`/ticket/getAll?low_price=20000`)
          .set({})
          .then(({ body, status }) => {
            expect(status).toBe(200)
            expect(body.tickets).toEqual(expect.any(Array))
            body.tickets.map(ticket => {
                expect(ticket.total_payment >= 20000).toBeTruthy()
            })
            done()
          })
      })
      it('Success getting all ticket data with price lower than equal 100000', (done) => {
        request(app).get(`/ticket/getAll?high_price=100000`)
          .set({})
          .then(({ body, status }) => {
            expect(status).toBe(200)
            expect(body.tickets).toEqual(expect.any(Array))
            body.tickets.map(ticket => {
                expect(ticket.total_payment <= 100000).toBeTruthy()
            })
            done()
          })
    })
    it('Success getting all ticket data with price lower than equal 100000, higher than equal 20000, from 2 hour ago, mobil only', (done) => {
        let time = new Date()
        time.addHours(-2)
        request(app).get(`/ticket/getAll?high_price=100000&low_price=20000&from_date=${time}&vehicle_type=mobil`)
          .set({})
          .then(({ body, status }) => {
            expect(status).toBe(200)
            expect(body.tickets).toEqual(expect.any(Array))
            body.tickets.map(ticket => {
                expect(ticket.total_payment <= 100000 && ticket.total_payment >=20000 && ticket.createdAt >= time && ticket.vehicle_type =="mobil").toBeTruthy()
            })
            done()
          })
    })
})