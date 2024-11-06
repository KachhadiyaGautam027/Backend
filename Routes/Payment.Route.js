const { Router } = require("express");
const { pay } = require("../Controllers/Payment.Controller");
const PaymentRoute = Router()

PaymentRoute.post("/pay",pay)

module.exports = PaymentRoute