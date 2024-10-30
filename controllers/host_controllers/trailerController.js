const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const { v4: uuidv4 } = require('uuid');


const getcordinates  = async (location) => {
  const googleMapsShortUrl = location;

  try {
      // Step 1: Expand the shortened URL
      const response = await fetch(googleMapsShortUrl, { method: 'HEAD', redirect: 'follow' });
      const expandedUrl = response.url;

      // Step 2: Extract latitude and longitude from the expanded URL
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = expandedUrl.match(regex);

      if (match) {
          const latitude = parseFloat(match[1]);
          const longitude = parseFloat(match[2]);
          return  { latitude, longitude };

      } else {
         return  { error: "Please enter a valid Google Maps URL" };

      }
  } catch (error) {
      console.error('Error expanding URL:', error);
      return  { error: "Please enter a valid Google Maps URL" };

  }
}


const addTrailer = async (req, res) => {
  const { body, user_id } = req;
  try {
      let data = body;
      let cordinates = await getcordinates(data.location);
      if(cordinates.error)
      {
        return res.status(400).json({ message: cordinates.error });
      }
      data.longitude = cordinates.longitude
      data.latitude = cordinates.latitude

      if(!data.category || !data.location || !data.latitude || !data.longitude)
      {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      // Function to generate random letters
      const generateRandomLetters = (length) => {
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          let result = '';
          for (let i = 0; i < length; i++) {
              result += letters.charAt(Math.floor(Math.random() * letters.length));
          }
          return result;
      };

      // Generate random 2-letter string and a random 3-digit number
      const randomLetters = generateRandomLetters(2); // Generates two random uppercase letters
      const randomNumber = Math.floor(Math.random() * 900) + 100; // Generates a random number between 100 and 999

      // Combine the parts into the trailer_id
      data.trailer_id = `Tra-${randomLetters}${randomNumber}`;
      data.host_id = user_id;

      const trailer = new Trailers(data);
      const savedTrailer = await trailer.save();

      return res.status(200).json({ message: 'Created', trailer: savedTrailer });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};



  
const getTrailerById = async (req, res) => {
    const { id } = req.params;  // Assuming `id` is passed as a URL parameter
    try {
      const trailer = await Trailers.findOne({ trailer_id: id }).populate('host_id');
      
      // Check if the trailer exists
      if (!trailer) {
        return res.status(404).json({ message: 'Trailer not found' });
      }
  
      // Return the trailer data
      return res.status(200).json({ message: 'Trailer found', trailer });
    } catch (error) {
      // Handle any errors
      return res.status(500).json({ message: `Failed to retrieve trailer: ${error.message}` });
    }
  }


  const getTrailersByStatus = async (req, res) => {
    const { status } = req.params;  // Assuming status is passed as a URL parameter
    try {
      // Query the database for trailers with the specified status
      const trailers = await Trailers.find({ status });
  
      // Check if any trailers are found
      if (trailers.length === 0) {
        return res.status(404).json({ message: 'No trailers found with the given status' });
      }
  
      // Return the list of trailers
      return res.status(200).json({ message: `Trailers with status '${status}' found`, trailers });
    } catch (error) {
      // Handle any errors
      return res.status(500).json({ message: `Failed to retrieve trailers: ${error.message}` });
    }
  };


  const getAllTrailers = async(req,res) => {
    const {user_id} = req
    try {
      trailers = await Trailers.find({host_id:user_id})
        return res.status(200).json({message: 'Trailers found', trailers})
      
    } catch (error) {
      return res.status(500).json({message: `Failed to retrieve trailers: ${error.message }`})
      
    }
  }


  const editTrailer = async (req, res) => {
    const { id } = req.params; // Assuming `id` is the trailer_id passed as a URL parameter
    const { body } = req; // New data for updating the trailer
  
    try {
      // Find the trailer by trailer_id and update with new data
      const updatedTrailer = await Trailers.findOneAndUpdate(
        { trailer_id: id }, // Search criteria
        body,               // New data from request body
        { new: true }       // Return the updated document
      );
  
      // Check if the trailer was found and updated
      if (!updatedTrailer) {
        return res.status(404).json({ message: 'Trailer not found' });
      }
  
      // Return the updated trailer data
      return res.status(200).json({ message: 'Trailer updated successfully', trailer: updatedTrailer });
    } catch (error) {
      // Handle any errors during the update process
      return res.status(500).json({ message: `Failed to update trailer: ${error.message}` });
    }
  };

  const trailerStatusUpdate = async (req, res) =>{
    const {trailer_id,status}  = req.body
    try {
      const trailer = await Trailers.findOneAndUpdate({trailer_id},{$set:{status}})
      if(!trailer){
        return res.status(404).json({message: 'Trailer not found'})
        }
        return res.status(200).json({message: 'Trailer status updated successfully', trailer})
      
    } catch (error) {
      return res.status(500).json({ message: `Failed to update trailer status: ${error}`})
      
    }

  }
module.exports = {
    addTrailer,
    getTrailerById,
    getTrailersByStatus,
    editTrailer,
    getAllTrailers,
    trailerStatusUpdate
};












