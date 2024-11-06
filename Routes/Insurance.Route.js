const { Router } = require("express");
const { createInsurance, getInsurances, getInsuranceById, updateInsurance, deleteInsurance } = require("../Controllers/Insurance.Controller");
const InsuranceRoute = Router()

InsuranceRoute.post("/craeteindurance" , createInsurance)
InsuranceRoute.get("/getallinsurance" , getInsurances)
InsuranceRoute.get("/singleinsurance/:id" , getInsuranceById)
InsuranceRoute.put("/updateinsurance/:id" , updateInsurance)
InsuranceRoute.delete("/deleteinsurance/:id" , deleteInsurance)

module.exports = InsuranceRoute