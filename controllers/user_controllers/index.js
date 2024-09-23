const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Orders } = require("../../models/orders");
const { Products } = require("../../models/products");
 
const updateProfile = async (req,res) => {
    const {body, user_id} = req
    const {name,email,phonenumber,store_id,avatar} = body
    try 
    {
        let newData = {name,email,store_id,phonenumber,avatar}
        const updatedata = {...newData}
        const update = await User_Auth_Schema.findByIdAndUpdate(user_id,
            {$set:updatedata},
            { new: true, runValidators: true }
        )
        if(!update)
        {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({message: "Profile Updated Successfully", data: update})
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
      }
    
} 



module.exports = {
    updateProfile,


};
