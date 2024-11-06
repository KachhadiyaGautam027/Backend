const jwt = require('jsonwebtoken');
require("dotenv").config();


const Auth = (req, res, next) => {
    // const { PatientToken } = req.cookies;

    // if (PatientToken) {
    //     try {
    //         const decoded = jwt.verify(PatientToken, process.env.jwtSecrate);
    //         req.body.PatientID = decoded.id; // Ensure 'id' exists in token payload
    //         next();
    //     } catch (error) {
    //         console.error("Token verification failed:", error);
    //         return res.status(401).json({ message: "Invalid token signature" });
    //     }
    // } else {
    //     console.warn("Authorization token not found");
    //     return res.status(403).json({ message: "You are not authorized" });
    // }
    const { PatientToken } = req.cookies;

    if (PatientToken) {
        try {
            const decoded = jwt.verify(PatientToken, process.env.jwtSecrate);
            req.PatientID = decoded.id; // Set PatientID directly on req
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({ message: "Invalid token signature" });
        }
    } else {
        console.warn("Authorization token not found");
        return res.status(403).json({ message: "You are not authorized" });
    }
};

// const AdminAuth = (req, res, next) => {
//     let { Admintoken } = req.cookies;

//     if (Admintoken) {
//             let decode = jwt.verify(Admintoken, process.env.AdminSecrate);
//             req.body.AdminID = decode.id;
//             next();
//     } else {
//         res.status(403).json("You are not authorized");
//     }
// };

// const AdminAuth = (req, res, next) => {
//     let { Admintoken } = req.cookies;

//     if (Admintoken) {
//         try {
//             const decode = jwt.verify(Admintoken, process.env.AdminSecrate);
//             req.adminID = decode.id;
//             console.log("Decoded Admin ID:", req.adminID);
//             next();
//         } catch (error) {
//             console.error("Token verification failed:", error);
//             return res.status(403).json("Invalid token");
//         }
//     } else {
//         res.status(403).json("You are not authorized");
//     }
// };

// const AdminAuth = (req, res, next) => {
//     let { Admintoken } = req.cookies;

//     // console.log("Received token:", Admintoken); 

//     if (Admintoken) {
//         try {
//             const decode = jwt.verify(Admintoken, process.env.AdminSecrate);
//             req.adminID = decode.id;
//             console.log("Decoded Admin ID:", req.adminID);
//             next();
//         } catch (error) {
//             console.error("Token verification failed:", error.message, error);
//             return res.status(403).json("Invalid token");
//         }
//     } else {
//         console.error("Authorization failed: No token provided");
//         res.status(403).json("You are not authorized");
//     }
// };

const AdminAuth = (req, res, next) => {
    const { Admintoken } = req.cookies;

    if (!Admintoken) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(Admintoken, process.env.AdminSecrate);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        req.adminID = decoded.id; // Attach adminID to request for further use
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

const DoctorAuth = (req, res, next) => {
    const { Doctortoken } = req.cookies;

    if (Doctortoken) {
        try {
            const decoded = jwt.verify(Doctortoken, process.env.DoctorSecrate);
            req.body.DoctorID = decoded.id; // Ensure this matches your JWT structure
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            res.status(403).json("Invalid token");
        }
    } else {
        res.status(403).json("You are not authorized");
    }
};

// const AuthDoctorOrAdmin = (req, res, next) => {
//     let { Doctortoken, Admintoken } = req.cookies;
//     console.log("Doctortoken:", Doctortoken);
//     console.log("Admintoken:", Admintoken);

//     if (Doctortoken) {
//       try {
//         let decode = jwt.verify(Doctortoken, process.env.DoctorSecrate);
//         console.log("Doctor decoded:", decode);
//         req.body.DoctorID = decode.id;
//         next();
//       } catch (err) {
//         console.error("Invalid doctor token:", err);
//         return res.status(403).json("Invalid doctor token");
//       }
//     } else if (Admintoken) {
//       try {
//         let decode = jwt.verify(Admintoken, process.env.AdminSecrate);
//         console.log("Admin decoded:", decode);
//         req.body.AdminID = decode.id;
//         next();
//       } catch (err) {
//         console.error("Invalid admin token:", err);
//         return res.status(403).json("Invalid admin token");
//       }
//     } else {
//       console.error("No valid tokens found");
//       return res.status(403).json("You are not authorized");
//     }
//   };

const AuthAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log("Token received:", token); // Log received token

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.AdminSecrate); // Verify the token
            console.log("Decoded token:", decoded); // Log decoded token details
            req.body.AdminID = decoded.id; // Attach the Admin ID to the request
            next(); // Proceed to the next middleware/route handler
        } catch (err) {
            console.error("Token verification failed:", err); // Log verification error
            return res.status(403).json({ msg: "Invalid admin token" }); // Handle invalid token
        }
    } else {
        console.error("No token provided"); // Log missing token
        return res.status(403).json({ msg: "No admin token provided" }); // Handle missing token
    }
};

const AuthPatientOrAdmin = (req, res, next) => {
    let { token, Admintoken } = req.cookies;

    if (token) {  // Check for Patient token
        try {
            let decode = jwt.verify(token, process.env.jwtSecrate);
            req.body.PatientID = decode.id;  // Attach PatientID to request body
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json("Invalid Patient token signature");
        }
    } else if (Admintoken) {  // Check for Admin token
        try {
            let decode = jwt.verify(Admintoken, process.env.AdminSecrate);
            req.body.AdminID = decode.id;  // Attach AdminID to request body
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json("Invalid Admin token signature");
        }
    } else {
        res.status(403).json("You are not authorized");
    }
};

const AuthPatientOrDoctor = (req, res, next) => {
    let { token, Doctortoken } = req.cookies;

    if (token) {  // Check for Patient token
        try {
            let decode = jwt.verify(token, process.env.jwtSecrate);
            req.body.PatientID = decode.id;  // Attach PatientID to request body
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json("Invalid Patient token signature");
        }
    } else if (Doctortoken) {  // Check for Admin token
        try {
            let decode = jwt.verify(Doctortoken, process.env.DoctorSecrate);
            req.body.DoctorID = decode.id;  // Set DoctorID to request body
            next();  // Proceed to next middleware or route handler
        } catch (error) {
            return res.status(401).json("Invalid Admin token signature");
        }
    } else {
        res.status(403).json("You are not authorized");
    }
};

module.exports = { Auth, AdminAuth, DoctorAuth, AuthPatientOrAdmin, AuthPatientOrDoctor, AuthAdmin };
