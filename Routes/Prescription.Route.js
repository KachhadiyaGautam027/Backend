const { Router } = require("express")
const { DoctorAuth } = require("../Middlewares/auth")
const { allAppointment, SingleAppoiment, AddPriscription, getPrescription,  SinglePrescription } = require("../Controllers/Prescription.Controller")
const PrescriptionRoute = Router()

// all appointment and SingleAppoiment
PrescriptionRoute.get("/AllAppointment",DoctorAuth,allAppointment)
PrescriptionRoute.get("/SingleAppoiment/:id", DoctorAuth,SingleAppoiment)


//create Prescription
PrescriptionRoute.post("/CreatePrescription/:id",DoctorAuth,AddPriscription)

//get Prescription
PrescriptionRoute.get("/getCreatePrescription/:id",DoctorAuth,getPrescription)

//single Prescription
PrescriptionRoute.get("/SinglePrescription/:id", DoctorAuth,SinglePrescription)


module.exports = PrescriptionRoute