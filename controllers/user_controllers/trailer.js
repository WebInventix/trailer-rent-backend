const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")




const userTrailerbyCategory = async (req,res)=>{
    const  {category} = req.params;

    try {
        const trailers =  await Trailers.find({category:category}).populate('host_id')
        const total = trailers.length
        console.log(total)
        res.status(200).json({message: "Trailer List", data: {trailers,total}})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }

}


module.exports = {

    userTrailerbyCategory

};
