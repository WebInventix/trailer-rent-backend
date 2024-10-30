const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")

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


const userTrailer = async (req,res)=>{
    try {
        const trailers = await Trailers.find()
        res.status(200).json({message: "Trailer List", data: trailers})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }

}

const getTraById = async (req,res)=>{
    const {id} = req.params
    try {
        const trailer = await Trailers.findById(id).populate('host_id')
        if(!trailer)
            {
                return res.status(404).json({ message: "Trailer not found" });
            }
                res.status(200).json({message: "Trailer Details", data: trailer})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const trailerByHost = async(req,res)=>{
    const {host_id} = req.params
    try {
        const trailer = await Trailers.find({host_id}).populate('host_id')
        res.status(200).json({message: "Trailer Details", data: trailer})
    } catch (error) {
        return res.status(500).json({ message: error.message });
        }

}
module.exports = {
    updateProfile,
    userTrailer,
    trailerByHost,
    getTraById


};
