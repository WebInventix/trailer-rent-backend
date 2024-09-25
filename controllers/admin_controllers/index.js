const mongoose = require('mongoose');
const crypto = require('crypto');
const { User_Auth_Schema } = require("../../models/user_auth_model");





const generateUniquePid = () => {
    const uniqueId = crypto.randomBytes(3).toString('hex'); // Generates a random 6-character hex string
    return `PID${uniqueId}`;
};

// const addStore = async (req,res) => {
//     const {body,user_data,user_id} = req;
//     const {name,avatar,status} = body;
    
//     if(!user_data.role=="Admin")
//     {
//         return res.status(401).json({message:"Not Authorize"})
//     }

//     try {
        
//         const store_data = {
//             name,
//             avatar,
//             status
//           };
//           // return res.json({msg:true})
//           const store_save = await Stores.create({
//             ...store_data,
//           });
//           return res.status(200).json({message:"Store-Created",store:store_save})

//     } catch (error) {
//         return res.status(500).json({message:"Error",error:error.message})
//     }
    
// }






module.exports = {

};
