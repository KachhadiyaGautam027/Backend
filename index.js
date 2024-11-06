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

app.use(cors({
  origin: "https://patient-frontend-kkt3.vercel.app", // Replace with your frontend URL
  credentials: true, // Allows credentials to be sent in the request
}));

app.use(express.json());

// const allowedOrigins = [
//   'https://patient-frontend-kkt3.vercel.app', // Replace with your current frontend URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));
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


const PORT = process.env.PORT || 5000;

// app.listen(process.env.PORT, () => {
//   console.log(`Server connected on port ${process.env.PORT}`);
//   connect();
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connect();
});