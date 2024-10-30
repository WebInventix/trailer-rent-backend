const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")


const getcordinates  = async (req,res) => {
    const googleMapsShortUrl = 'https://maps.app.goo.gl/u5UVJ9mK4a5CX26YA';

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
            res.json({ latitude, longitude });
        } else {
            res.status(400).json({ error: 'Coordinates not found in URL' });
        }
    } catch (error) {
        console.error('Error expanding URL:', error);
        res.status(500).json({ error: 'Failed to expand and retrieve coordinates' });
    }
}
const userTrailerbyCategory = async (req,res)=>{
    const  {category} = req.body;

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

    userTrailerbyCategory,
    getcordinates

};
