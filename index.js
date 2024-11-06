require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const connect = require("./Config/db");
const PatientRoute = require("./Routes/Patient.Route");
const AdminRoute = require("./Routes/Admin.Route");
const DoctorRoute = require("./Routes/Doctor.Route");
const PrescriptionRoute = require("./Routes/Prescription.Route");
const AppointmentRoute = require("./Routes/Appointment.Route");
const InvoiceRoute = require("./Routes/Invoice.Route");
const InsuranceRoute = require("./Routes/Insurance.Route");
const PaymentRoute = require("./Routes/Payment.Route");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect();

app.use(
  cors({
    origin: 'https://pasient-frontend.vercel.app',  // Your Vercel frontend URL
    credentials: true,  // Allow cookies or other credentials to be sent
  })
);

app.use(cookie());

app.use("/patient", PatientRoute);
app.use("/admin", AdminRoute);
app.use("/doctor", DoctorRoute);
app.use("/Appointment", AppointmentRoute);
app.use("/prescription", PrescriptionRoute);
app.use("/invoice", InvoiceRoute);
app.use("/insurance", InsuranceRoute);
app.use("/payment", PaymentRoute);

app.listen(process.env.PORT, () => {
  console.log(`server connected ${process.env.PORT}`);
  connect();
});
