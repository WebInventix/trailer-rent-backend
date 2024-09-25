const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");


const kycVerification = async (req,res,next) => {
const {user_id, user_data} = req
return res.status(200).json({user_data,user_id}) 
}






module.exports = {
kycVerification
};
