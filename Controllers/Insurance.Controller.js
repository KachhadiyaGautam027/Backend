const insuranceModel = require("../Models/Insurance.Schema");

const createInsurance = async (req, res) => {
    try {
        const insurance = await insuranceModel(req.body);
        await insurance.save();
        res.status(201).json({
            success: true,
            data: insurance,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create insurance record',
            error: error.message,
        });
    }
}

const getInsurances = async (req, res) => {
    try {
        const insurances = await insuranceModel.find()
            .populate('BillID')
            .populate('DoctorID')
            .populate('PatientID');
        res.status(200).json({
            success: true,
            data: insurances,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch insurance records',
            error: error.message,
        });
    }
};


const getInsuranceById = async (req, res) => {
    try {
        const insurance = await insuranceModel.findById(req.params.id)
            .populate('BillID')
            .populate('DoctorID')
            .populate('PatientID');

        if (!insurance) {
            return res.status(404).json({
                success: false,
                message: 'Insurance record not found',
            });
        }

        res.status(200).json({
            success: true,
            data: insurance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch the insurance record',
            error: error.message,
        });
    }
};

const updateInsurance = async (req, res) => {
    try {
        const updatedInsurance = await insuranceModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedInsurance) {
            return res.status(404).json({
                success: false,
                message: 'Insurance record not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedInsurance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update insurance record',
            error: error.message,
        });
    }
};

const deleteInsurance = async (req, res) => {
    try {
        const insurance = await insuranceModel.findByIdAndDelete(req.params.id);

        if (!insurance) {
            return res.status(404).json({
                success: false,
                message: 'Insurance record not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Insurance record deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete insurance record',
            error: error.message,
        });
    }
};

module.exports={createInsurance,getInsurances,getInsuranceById,updateInsurance,deleteInsurance}