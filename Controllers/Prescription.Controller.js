const AppointmentModel = require("../Models/Appointment.Schema");
const PrescriptionModel = require("../Models/Prescription.Schema");


// doctor all appointment
const allAppointment = async (req, res) => {
    try {
        const allPresciption = await AppointmentModel.find({ DoctorID: req.body.DoctorID }).populate("PatientID", "firstname lastname age gender");
        res.status(200).json(allPresciption);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// single appointment
const SingleAppoiment = async (req, res) => {
    try {
        let { id } = req.params
        const SingleAppoiment = await AppointmentModel.findById(id)
            .populate({ path: "PatientID", select: "firstname lastname phonenumber gender age address" })
            .populate({ path: "DoctorID", select: "DoctorName" });
        res.json(SingleAppoiment)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//Create Prescription
const AddPriscription = async (req, res) => {
    try {
        let { id } = req.params
        let { medications, note } = req.body;
        if (id) {
            let Appointment=await AppointmentModel.findById(id)
            .populate({ path: "PatientID", select: "id" })
            console.log(Appointment.PatientID.id);

            const prescription = new PrescriptionModel({
                PatientID: Appointment.PatientID._id, // Ensure you're setting the ObjectId
                DoctorID: Appointment.DoctorID._id, // Ensure you're setting the ObjectId
                AppointmentID:Appointment.id, // The Appointment ID
                medications, // List of medications passed from the request body
                note // Optional note passed from the request body
            });
            await prescription.save();

        // Return success response
        res.status(201).json({
            message: "Prescription created successfully",
            prescription
        });
            
        } else {
            res.json("Appointment not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//get Prescription
const getPrescription=async(req,res)=>{
    try {
        let{id}=req.params
        let data=await PrescriptionModel.find({AppointmentID:id,DoctorID:req.body.DoctorID})
        .populate({ path: "PatientID", select: "firstname lastname phonenumber age gender" }) 
        .populate({ path: "DoctorID", select: "DoctorName" }) // You can populate the relevant fields if needed
        .populate({ path: "AppointmentID", select: "appointmentdate appointmentTime" }); // You can populate the relevant fields if needed
        res.json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//single Prescription
const SinglePrescription=async(req,res)=>{
    try {
        let{id}=req.params
    const SinglePrescription = await PrescriptionModel.findById(id)
    .populate({ path: "PatientID", select: "firstname lastname gender age address" })
    .populate({ path: "DoctorID", select: "DoctorName HospitalName" });
    res.json(SinglePrescription)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { allAppointment, SingleAppoiment, AddPriscription ,getPrescription,SinglePrescription}