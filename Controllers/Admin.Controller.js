const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const AdmintModel = require("../Models/Admin.Schema")
const HospitalModel = require("../Models/Hospital.Schema")
const DoctorModel = require("../Models/Doctor.schema");
const PatientModel = require("../Models/PatientSchema");

const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, country, state, city, password, confirmpassword } = req.body;

        const existingUser = await AdmintModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new AdmintModel({
            firstname,
            lastname,
            email,
            phonenumber,
            country,
            state,
            city,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(200).json({ msg: "User registered successfully", newUser });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let data = await AdmintModel.findOne({ email: email });
        if (!data) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        let Admintoken = jwt.sign({ id: data._id }, process.env.AdminSecrate, { expiresIn: '1h' });

        res.cookie("Admintoken", Admintoken).cookie("id", data._id);

        res.status(200).json({ message: "Successfully Login", data, Admintoken });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const resetpassword = async (req, res) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body;
        const user = await AdmintModel.findOne({ _id: req.adminID });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Log user password from the database
        console.log("User's hashed password from DB:", user.Password);

        // Check if the old password matches the hashed password in the DB
        const isMatch = await bcrypt.compare(oldpassword, user.password);

        // Log comparison result
        console.log("Does the old password match?", isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        }

        if (newpassword !== confirmpassword) {
            return res.status(400).json({ msg: "New password and confirm password do not match" });
        }

        const hashedNewPassword = await bcrypt.hash(newpassword, 10);

        await AdmintModel.findByIdAndUpdate(user._id, { password: hashedNewPassword });

        return res.status(200).json({ msg: "Password reset successfully" }); // Uncommented to send response
    } catch (error) {
        console.error("Error in resetpassword:", error);
        res.status(500).json({ msg: error.message });
    }
};

const AdminProfile = async (req, res) => {
    try {
        console.log("Fetching admin profile for ID:", req.adminID);
        const adminData = await AdmintModel.findById(req.adminID);
        if (!adminData) return res.status(404).json({ msg: "Admin not found" });
        res.status(200).json(adminData);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ msg: error.message });
    }
}

const AdminUpdate = async (req, res) => {
    try {
        console.log("Updating admin with ID:", req.adminID);
        console.log("Update data:", req.body);


        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        const updatedData = await AdmintModel.findByIdAndUpdate(req.adminID, updateData, { new: true });
        if (!updatedData) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        res.status(200).json({ msg: "Profile updated successfully", data: updatedData });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ msg: error.message });
    }
}

const addHospital = async (req, res) => {
    try {
        let admin = await AdmintModel.findById({ _id: req.body.AdminID })
        let data = await HospitalModel.create(req.body)
        admin.hospital.push(data._id)
        admin.save()
        res.json(data)
    } catch (error) {
        res.json({ msg: error.message })
    }
}

const AllDoctor = async (req, res) => {
    try {
        let doctors = await DoctorModel.find()
        res.json(doctors)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const UpdateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.Password) {
            // Hash the new password
            req.body.Password = await bcrypt.hash(req.body.Password, 10);
        }

        const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedDoctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }   

        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error("Error updating doctor:", error.message);
        res.status(500).json({ msg: "Failed to update doctor" });
    }
};

const DeleteDoctor = async (req, res) => {
    try {
        let { id } = req.params;
        let doctor = await DoctorModel.findByIdAndDelete(id);

        if (!doctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }

        res.json({ msg: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const AddDoctor = async (req, res) => {
    try {
        const { DoctorEmail, Password } = req.body;

        // Check for required fields
        if (!DoctorEmail || !Password) {
            return res.status(400).json({ msg: "Email and password are required." });
        }

        // Check if the doctor already exists
        const existingDoctor = await DoctorModel.findOne({ DoctorEmail });
        if (existingDoctor) {
            return res.status(400).json({ msg: "Doctor with this email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Handle file uploads
        const doctorImageFile = req.files.DoctorImage ? req.files.DoctorImage[0] : null;
        const doctorSignatureFile = req.files.DoctorSignature ? req.files.DoctorSignature[0] : null;

        let doctorImageUrl = '';
        let doctorSignatureUrl = '';

        // Upload image to Cloudinary if file exists
        if (doctorImageFile) {
            const uploadedImage = await cloudinary.uploader.upload(doctorImageFile.path);
            doctorImageUrl = uploadedImage.secure_url;
        }

        // Upload signature to Cloudinary if file exists
        if (doctorSignatureFile) {
            const uploadedSignature = await cloudinary.uploader.upload(doctorSignatureFile.path);
            doctorSignatureUrl = uploadedSignature.secure_url;
        }

        // Create a new doctor record
        const newDoctor = new DoctorModel({
            ...req.body,
            Password: hashedPassword,
            DoctorImage: doctorImageUrl,
            DoctorSignature: doctorSignatureUrl,
        });

        await newDoctor.save();
        return res.status(201).json({ msg: "Doctor added successfully!" });
    } catch (error) {
        console.error("Error saving doctor:", error);
        return res.status(500).json({ msg: "Failed to add doctor. Please try again." });
    }
};




const AllPatient = async (req, res) => {
    try {
        let patients = await PatientModel.find()
        res.json(patients)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = { signup, login, resetpassword, addHospital, AddDoctor, AdminProfile, AdminUpdate, AllDoctor, UpdateDoctor, DeleteDoctor, AllPatient }