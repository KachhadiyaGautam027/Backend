const billModel = require("../Models/Invoice.Schema");


const createBill = async (req, res) => {
  try {
    const {
      description,
      paymentType,
      date,
      time,
      amount,
      discount,
      tax,
    } = req.body;

    if (
      
      !description ||
      !paymentType ||
      !time ||
      !amount ||
      !discount ||
      !tax
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBill = new billModel(req.body);
    await newBill.save();
    res.status(201).json({
      success: true,
      data: newBill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create the bill",
      error: error.message,
    });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await billModel
      .find()
      .populate("PatientID DoctorID InsuranceID");
    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};

// Get a single bill by ID
const getBillById = async (req, res) => {
  try {
    const bill = await billModel
      .findById(req.params.id)
      .populate("PatientID DoctorID InsuranceID");
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch the bill",
      error: error.message,
    });
  }
};

const updateBill = async (req, res) => {
  try {
    const updatedBill = await billModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the bill",
      error: error.message,
    });
  }
};

const deleteBill = async (req, res) => {
  try {
    const bill = await billModel.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the bill",
      error: error.message,
    });
  }
};


module.exports={createBill,getBills,getBillById,updateBill,deleteBill}