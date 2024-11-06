const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const PatientModel = require("../Models/PatientSchema")

const signup = async (req, res) => {
    // console.log('Received data:', req.body);
    try {
        const {
            firstname,
            lastname,
            email,
            phonenumber,
            age,
            height,
            weight,
            BloodGroup,
            dateofbirth,
            country,
            state,
            city,
            gender,
            address,
            password,
            confirmPassword,
        } = req.body;

        // Check if user already exists
        const existingUser = await PatientModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = new PatientModel({
            firstname,
            lastname,
            email,
            phonenumber,
            age,
            height,
            weight,
            BloodGroup,
            dateofbirth,
            country,
            state,
            city,
            gender,
            address,
            password: hashedPassword,

        });

        // Save the user to the database
        await newUser.save();

        res.status(200).json({ msg: "User registered successfully", newUser });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let data = await PatientModel.findOne({ email: email });
        if (data) {
            bcrypt.compare(password, data.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ id: data._id }, process.env.jwtSecrate);
                    res.cookie("PatientToken", token).cookie("id", data._id);
                    // console.log("PatientToken", token);
                    res.status(200).json({ message: "Successfully Login", data, token });
                } else {
                    res.status(400).json({ message: "Password incorrect" });
                }
            });
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        res.json({ msg: error.message })
    }
};

const resetpassword = async (req, res) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body;
        const user = await PatientModel.findOne({ _id: req.body.PatientID });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        else {

            // Compare oldpassword with the stored hashed password
            const isMatch = await bcrypt.compare(oldpassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Old password is incorrect" });
            }
            else {

                // Check if newpassword matches confirmpassword
                if (newpassword !== confirmpassword) {
                    return res.status(400).json({ msg: "New password and confirm password do not match" });
                }
                else {

                    // Hash the new password before saving it
                    const hashedNewPassword = await bcrypt.hash(newpassword, 10);

                    // Update the password in the database
                    await PatientModel.findByIdAndUpdate(user._id, { password: hashedNewPassword });

                    res.status(200).json({ msg: "Password reset successfully" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
// patient profile
const PatientProfile = async (req, res) => {
    try {
        // console.log("Fetching Patient profile for ID:", req.PatientID);
        const patientdata = await PatientModel.findById(req.PatientID);
        if (!patientdata) return res.status(404).json({ msg: "Patient not found" });
        res.status(200).json(patientdata);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ msg: error.message });
    }
}

// patient profile Update
// const PatientUpdate = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // console.log("Updating patient with ID:", id); 

//         const updateData = { ...req.body };
//         if (req.file) {
//             updateData.imageUrl = req.file.path;
//         }

//         if (!id) {
//             return res.status(400).json({ msg: "Patient ID is required" });
//         }

//         const updatedData = await PatientModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

//         if (!updatedData) {
//             return res.status(404).json({ msg: "Patient not found" });
//         }

//         res.status(200).json({ message: "Update successful", data: updatedData });
//     } catch (error) {
//         console.error("Error updating patient:", error);
//         res.status(500).json({ msg: error.message });
//     }
// };

const PatientUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Patient ID is required" });
        }

        // Prepare the update data
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        // Use findByIdAndUpdate to update the patient
        const updatedData = await PatientModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        // Check if the patient was found and updated
        if (!updatedData) {
            return res.status(404).json({ msg: "Patient not found" });
        }

        // Return the success response with updated patient data
        res.status(200).json({ message: "Update successful", data: updatedData });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ msg: error.message });
    }
};



module.exports = { signup, login, resetpassword, PatientProfile, PatientUpdate }