const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const { v4: uuidv4 } = require('uuid');

const addTrailer = async (req,res) => {
  const  {body} = req
    try{
        let data = body
        data.trailer_id= `Tra-${uuidv4()}`;
        const trailer = new Trailers(data);
        const savedTrailer = await trailer.save();
        return res.status(200).json({message:'Created',trailer:savedTrailer})
    } catch (error) {
        throw new Error(`Failed to create trailer: ${error.message}`);
    }
}


module.exports = {
    addTrailer
};
