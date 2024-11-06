const AppointmentModel = require("../Models/Appointment.Schema");
const DoctorModel = require("../Models/Doctor.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const PatientModel = require("../Models/PatientSchema");

const login = async (req, res) => {
    try {
        const { DoctorEmail, Password } = req.body;

        // Find the doctor by email
        const doctor = await DoctorModel.findOne({ DoctorEmail });

        if (!doctor) {
            console.log("Login attempt failed: user not found");
            return res.status(400).json({ message: "User not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(Password, doctor.Password);
        console.log("Password Match Result:", isMatch);

        if (!isMatch) {
            console.log("Login attempt failed: incorrect password");
            return res.status(400).json({ message: "Password incorrect" });
        }

        // Create and set JWT token
        const Doctortoken = jwt.sign({ id: doctor._id }, process.env.DoctorSecrate, { expiresIn: '1h' });
        res.cookie("Doctortoken", Doctortoken, { httpOnly: true, secure: true });
        res.cookie("id", doctor._id);

        console.log('Doctortoken', Doctortoken);


        return res.status(200).json({ message: "Successfully logged in", Dtoken: Doctortoken, data: doctor });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

//change password , reset password
const resetpassword = async (req, res) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body;

        // Log the DoctorID to ensure it's correct
        console.log("DoctorID from request:", req.body.DoctorID);

        const user = await DoctorModel.findOne({ _id: req.body.DoctorID });

        // Log the retrieved user
        console.log("Retrieved user:", user);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Log user's hashed password
        console.log("User's hashed password from DB:", user.Password);

        // Check if the old password matches the hashed password in the DB
        const isMatch = await bcrypt.compare(oldpassword, user.Password);

        // Log comparison result
        console.log("Does the old password match?", isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        }

        if (newpassword !== confirmpassword) {
            return res.status(400).json({ msg: "New password and confirm password do not match" });
        }

        const hashedNewPassword = await bcrypt.hash(newpassword, 10);

        // Ensure you're updating the correct model
        await DoctorModel.findByIdAndUpdate(user._id, { Password: hashedNewPassword });

        return res.status(200).json({ msg: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetpassword:", error);
        res.status(500).json({ msg: error.message });
    }
};


// doctor profile
const DoctorProfile = async (req, res) => {
    try {
        // console.log("Fetching admin profile for ID:", req.DoctorID);
        let doctordata = await DoctorModel.findById({ _id: req.body.DoctorID })
        if (!doctordata) return res.status(404).json({ msg: "Docotr not found" });
        res.json(doctordata)
    } catch (error) {
        res.state(500).json({ msg: error.message })
    }
}

// doctor profile Update
const DoctorUpdate = async (req, res) => {
    try {
        // Log the ID of the doctor being updated and the update data
        console.log("Updating doctor with ID:", req.params.id);
        console.log("Update data:", req.body);

        // Extract the doctor ID from request parameters
        const { id } = req.params;

        // Prepare the data to be updated
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        // Update the doctor record in the database
        const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, updateData, { new: true });

        // Check if the doctor was found and updated
        if (!updatedDoctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }

        // Return a success response with the updated doctor data
        res.status(200).json({ msg: "Profile updated successfully", data: updatedDoctor });

    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ msg: error.message });
    }
};





// Appointment Record
const AppointmentRecord = async (req, res) => {
    try {
        const appointmentHistory = await AppointmentModel.find({ DoctorID: req.body.DoctorID })
            .populate('PatientID', 'firstname lastname age gender') // Populates patient information

        res.status(200).json({ message: 'Doctor appointment history', data: appointmentHistory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//PatientRecord
const PatientRecord = async (req, res) => {
    try {
        let Patient = await PatientModel.find()
        res.json(Patient)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// single page patient details
const SinglePatient = async (req, res) => {
    try {
        let { id } = req.params;
        const singlepatient = await PatientModel.findById(id)
            .populate({ path: "AppointmentID" });
        res.json(singlepatient);
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error.message });
    }
};


module.exports = { login, resetpassword, DoctorProfile, DoctorUpdate, PatientRecord, SinglePatient, AppointmentRecord }