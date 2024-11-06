const { Router } = require("express");
const { createBill, getBills, getBillById, updateBill, deleteBill } = require("../Controllers/Invoice.Controller");
const InvoiceRoute = Router()

InvoiceRoute.post("/createbill", createBill);
InvoiceRoute.get("/getbill", getBills);
InvoiceRoute.get("/singlebill/:id", getBillById);
InvoiceRoute.patch("/billupdate/:id", updateBill);
InvoiceRoute.delete("/deletebill/:id", deleteBill);

module.exports = InvoiceRoute