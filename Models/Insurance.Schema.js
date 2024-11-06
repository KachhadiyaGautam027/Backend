const mongoose = require("mongoose");

// Create the Insurance Schema
const insuranceSchema = new mongoose.Schema(
  {
    BillID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
    DoctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    PatientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    diseaseName: {
      type: String,
      required: [true, "Disease name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    insuranceCompany: {
      type: String,
      required: true,
      enum: [
        "HDFC Life Insurance",
        "LIC Life Insurance",
        "Aegon Life Insurance",
      ],
      trim: true,
    },
    insurancePlan: {
      type: String,
      required: true,
      enum: ["Maternity", "Medical", "Health"],
      trim: true,
    },
    billDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    claim_amount: {
      type: Number,
      min: [0],
    },
    claimed_amount: {
      type: Number,
    },
    insuranceCompany: {
      type: String,
      required: true,
      enum: [
        "HDFC Life Insurance",
        "LIC Life Insurance",
        "Aegon Life Insurance",
      ],
      trim: true,
    },
    insurancePlan: {
      type: String,
      required: true,
      enum: ["Maternity", "Medical", "Health"],
      trim: true,
    },
  },
  { timestamps: true }
);

const insuranceModel = mongoose.model("Insurance", insuranceSchema);

module.exports= insuranceModel;