const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    DoctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", 
    },
    AdminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    message: {
      type: String,
      required: true,
    },
    AppointmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports= notificationModel;
