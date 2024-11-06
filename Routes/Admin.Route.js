const { Router } = require("express")
const { signup, login, resetpassword, addHospital, AddDoctor, AdminProfile, AdminUpdate, AllDoctor, UpdateDoctor, DeleteDoctor, AllPatient } = require("../Controllers/Admin.Controller")
const { AdminAuth, AuthAdmin } = require("../Middlewares/auth")
const AdminRoute = Router()

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// admin login , signup
AdminRoute.post("/signup", signup)
AdminRoute.post("/login", login)
AdminRoute.patch("/resetpassword", AdminAuth, resetpassword)

// admin profile
AdminRoute.get("/profile", AdminAuth, AdminProfile)
AdminRoute.patch("/update", AdminAuth, upload.single("image"), AdminUpdate);

// admin add hospital
AdminRoute.post("/addhospital", AdminAuth, addHospital)

//All doctors
AdminRoute.get("/alldoctors", AdminAuth, AllDoctor)

// update doctor data
AdminRoute.put("/UpdateDoctor/:id", AdminAuth, UpdateDoctor);


// delete doctor data
AdminRoute.delete("/deletedoctor/:id", AdminAuth, DeleteDoctor);

// admin add doctor
AdminRoute.post("/adddoctor",
  AuthAdmin,
  upload.fields([
    { name: "DoctorImage", maxCount: 1 },
    { name: "DoctorSignature", maxCount: 1 },
  ]),
  // Validation rules
  AddDoctor
);

AdminRoute.get("/allpatient", AdminAuth, AllPatient)

module.exports = AdminRoute