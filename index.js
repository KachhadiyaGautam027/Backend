require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connect = require("./Config/db");
const PatientRoute = require("./Routes/Patient.Route");
const AdminRoute = require("./Routes/Admin.Route");
const DoctorRoute = require("./Routes/Doctor.Route");
const PrescriptionRoute = require("./Routes/Prescription.Route");
const AppointmentRoute = require("./Routes/Appointment.Route");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "https://patient-frontend-tgu5.vercel.app", // Adjust with your Vercel URL
    credentials: true,
  })
);
app.use(cookieParser());

// Route handlers
app.use("/patient", PatientRoute);
app.use("/admin", AdminRoute);
app.use("/doctor", DoctorRoute);
app.use("/Appointment", AppointmentRoute);
app.use("/prescription", PrescriptionRoute);


app.get('/', (req, res) => {
  res.send('Welcome to the Healthcare System API');
});

app.listen(process.env.PORT, () => {
  console.log(`Server connected on port ${process.env.PORT}`);
  connect();
});
