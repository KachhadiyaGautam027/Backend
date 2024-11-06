const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
    {
        DoctorImage: {
            url: String,
            filename: String,
        },
        DoctorSignature: {
            url: String,
            filename: String,
        },
        DoctorName: { type: String, required: true },
        DoctorQualification: { type: String, required: true },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        specialtiyType: { type: String, required: false },
        WorkOn: { type: String, required: true },
        workingTime: {
            type: String,
            required: true,
            // validate: {
            //     validator: function (v) {
            //         return /^([0-9]{1,2}):([0-9]{2})$/.test(v);
            //     },
            //     message: (props) => `${props.value} is not a valid time format`,
            // },
        },

        CheckupTime: {
            type: String,
            required: true,
            type: String,
            required: true,
            // validate: {
            //     validator: function (v) {
            //         return /^([0-9]{1,2}):([0-9]{2})$/.test(v);
            //     },
            //     message: (props) => `${props.value} is not a valid time format`,
            // },
        },
        BreakTime: {
            type: String,
            required: true,
            type: String,
            required: true,
            // validate: {
            //     validator: function (v) {
            //         return /^([0-9]{1,2}):([0-9]{2})$/.test(v);
            //     },
            //     message: (props) => `${props.value} is not a valid time format`,
            // },
        },
        LastName: { type: String, required: false },
        Experience: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        age: { type: Number, required: true },
        DoctorEmail: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        ZipCode: { type: Number, required: true },
        DoctorAddress: { type: String, required: true },
        Description: { type: String, required: true },
        OnlineConsultationRate: { type: Number, required: true },
        DoctorCurrentHospital: { type: String, required: true },
        HospitalName: { type: String, required: true },
        HospitalAddress: { type: String, required: true },
        HospitalWebsiteLink: { type: String, required: true },
        EmergencyContactNumber: { type: Number, required: true },
        Password: { type: String, required: true },
        DoctorImage: {
            type: String, // URL of the image
        },
        DoctorSignature: {
            type: String, // URL of the signature
        },
        imageUrl: { type: String, required: false }, 
        AdminID: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
    { timestamps: true }
);

let DoctorModel = mongoose.model("Doctor", DoctorSchema);

module.exports = DoctorModel;