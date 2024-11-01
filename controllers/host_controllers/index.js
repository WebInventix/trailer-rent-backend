const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Banks } = require("../../models/Banks")
const { Trailers } = require("../../models/trailer")


const dashboard = async (req,res) => {
    const {user_id} = req
    try {
        const trailers = await Trailers.find({host_id:user_id})
        console.log(user_id,trailers)
        let trailer_count = trailers.length
        return res.status(200).json({message:'Dashboard',trailer_count:trailer_count})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message})
        
    }
}

const createBank = async (req, res) => {
    try {
        const { 
            host_id, 
            account_name, 
            account_number, 
            first_name, 
            last_name, 
            routing_number, 
            address_1, 
            address_2, 
            country, 
            state, 
            city, 
            postal_code, 
            SSN, 
            status 
        } = req.body;

        // Validation for required fields
        if (!host_id || !account_name || !account_number || !first_name || !last_name || !routing_number || !address_1 || !country || !state || !city || !postal_code || !SSN || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate country enum values
        const validCountries = ['Canada', 'USA'];
        if (!validCountries.includes(country)) {
            return res.status(400).json({ message: "Invalid country. Allowed values are 'Canada' or 'USA'." });
        }

        // Validate status enum values
        const validStatuses = ['Pending', 'Approve', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values are 'Pending', 'Approve', or 'Rejected'." });
        }

        // Check if the account number already exists
        const existingAccount = await Banks.findOne({ account_number });
        if (existingAccount) {
            return res.status(409).json({ message: "Account number already exists." });
        }

        // Check for valid postal code (for example, US format: 5 digits)
        if (!/^\d{5}(-\d{4})?$/.test(postal_code)) {
            return res.status(400).json({ message: "Invalid postal code format." });
        }

        // Optional: Add other validations as necessary (e.g., SSN format)
        // if (!/^\d{3}-\d{2}-\d{4}$/.test(SSN)) {
        //     return res.status(400).json({ message: "Invalid SSN format. Correct format is XXX-XX-XXXX." });
        // }

        // If all validations pass, create the bank record
        const newBank = new Banks(req.body);
        const savedBank = await newBank.save();
        res.status(201).json({message:"Added Successfully", savedBank});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateBank = async (req, res) => {
    try {
        const { id } = req.params;  // Extract the ID from request parameters
        const {
       
            account_name,
            account_number,
            first_name,
            last_name,
            routing_number,
            address_1,
            address_2,
            country,
            state,
            city,
            postal_code,
            SSN,
            status
        } = req.body;

        // Validation for required fields (you can modify this based on which fields are optional)
        if ( !account_name || !account_number || !first_name || !last_name || !routing_number || !address_1 || !country || !state || !city || !postal_code || !SSN || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate country enum values
        const validCountries = ['Canada', 'USA'];
        if (!validCountries.includes(country)) {
            return res.status(400).json({ message: "Invalid country. Allowed values are 'Canada' or 'USA'." });
        }

        // Validate status enum values
        const validStatuses = ['Pending', 'Approve', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values are 'Pending', 'Approve', or 'Rejected'." });
        }

        // Check if the new account number is already used by another account (prevent duplicate account number)
        const existingAccount = await Banks.findOne({ account_number });
        if (existingAccount && existingAccount._id.toString() !== id) {
            return res.status(409).json({ message: "Account number already exists." });
        }

        // Validate postal code format (example for US postal codes)
        if (!/^\d{5}(-\d{4})?$/.test(postal_code)) {
            return res.status(400).json({ message: "Invalid postal code format." });
        }

        // Validate SSN format (example for US SSNs)
        // if (!/^\d{3}-\d{2}-\d{4}$/.test(SSN)) {
        //     return res.status(400).json({ message: "Invalid SSN format. Correct format is XXX-XX-XXXX." });
        // }

        // Find the bank account by ID and update it
        const updatedBank = await Banks.findByIdAndUpdate(
            id,
            {
                account_name,
                account_number,
                first_name,
                last_name,
                routing_number,
                address_1,
                address_2,
                country,
                state,
                city,
                postal_code,
                SSN,
                status
            },
            { new: true } // Return the updated record
        );

        if (!updatedBank) {
            return res.status(404).json({ message: "Bank record not found." });
        }

        res.status(200).json({message:"Updated Succesfully", updatedBank});  // Return the updated bank record

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBanks = async  (req, res) => {
    const {user_id} =req
    try {
        const banks = await Banks.find({host_id:user_id});
        res.status(200).json(banks);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updateProfile = async (req, res) => {
    const { user_id } = req;  // Extract user ID from the request (make sure it's being passed correctly)
    const { first_name, last_name, phonenumber, email, email_notifications, number_notifications, avatar } = req.body;

    try {
        // Find the user by ID and update with new data
        const updatedUser = await User_Auth_Schema.findByIdAndUpdate(
            user_id, 
            {
                first_name,
                last_name,
                phonenumber,
                email,
                email_notifications,
                number_notifications,
                avatar
            },
            { 
                new: true, // Return the updated document
                runValidators: true  // Run schema validation
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Updated Successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateBankStatus = async (req, res) => {
    const { bank_id, is_active } = req.body;
    const { user_id } =req

    try {
        // If setting the bank account to active, deactivate all other accounts for this user
        if (is_active === 'Active') {
            // Deactivate all other bank accounts for the user
            await Banks.updateMany(
                { host_id: user_id, _id: { $ne: bank_id } },
                { is_active: 'Not-Active' }
            );
            
            // Activate the specified bank account
            await Banks.findByIdAndUpdate(bank_id, { is_active: 'Active' });
            let all_banks = await Banks.find({host_id:user_id}).populate('host_id')
            return res.status(200).json({ message: 'Bank account set to active and others deactivated',banks:all_banks });
        } else {
            // // If setting to not-active, check if there is any other active bank account
            // const otherActiveBank = await Banks.findOne({
            //     host_id: user_id,
            //     is_active: 'Active',
            //     _id: { $ne: bank_id }
            // });
            
            // if (otherActiveBank) {
            //     // Another active bank account exists, so set this one to not-active
            //     await Banks.findByIdAndUpdate(bank_id, { is_active: 'Not-Active' });
            //     res.status(200).json({ message: 'Bank account set to not-active' });
            // } else {
            //     // No other active account exists, so set this one to active by default
            //     await Banks.findByIdAndUpdate(bank_id, { is_active: 'Active' });
            //     res.status(200).json({ message: 'No other active bank accounts, so this one set to active' });
            // }
            return res.status(200).json({ message: "No other active bank accounts, so we can't set this to Not-Active" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBank,
    updateBank,
    getBanks,
    updateProfile,
    dashboard,
    updateBankStatus
};
