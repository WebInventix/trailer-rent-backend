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
     const { minPrice, maxPrice, minLength, maxLength, minWeight, maxWeight, hitchType, category, location } = req.body;


    // Build query based on provided filters
    const query = {};

    if (minPrice && maxPrice) {
        query.daily_rate = { $gte: minPrice, $lte: maxPrice };
    }

    if (minLength && maxLength) {
        query.trailer_length = { $gte: minLength, $lte: maxLength };
    }

    if (minWeight && maxWeight) {
        query.payload_capacity = { $gte: minWeight, $lte: maxWeight };
    }

    if (hitchType) {
        query.hitch_type = hitchType;
    }
    if(category){
        query.category = category
    }
    if (location) {
        // Use a case-insensitive regex to search for the location in complete_address
        query.complete_address = { $regex: location, $options: 'i' };
    }

    try {
        // Fetch trailers matching the query
        const trailers = await Trailers.find(query);
        const total = trailers.length
        return res.status(200).json({data:{trailers,total}})
    } catch (error) {
        console.error("Error fetching trailers:", error);
        res.status(500).json({ error: "Failed to fetch trailers" });
    }

}

const trailerSearch = async (req,res) => {
    const { minPrice, maxPrice, minLength, maxLength, minWeight, maxWeight, hitchType, category, location } = req.body;


    // Build query based on provided filters
    const query = {};

    if (minPrice && maxPrice) {
        query.daily_rate = { $gte: minPrice, $lte: maxPrice };
    }

    if (minLength && maxLength) {
        query.trailer_length = { $gte: minLength, $lte: maxLength };
    }

    if (minWeight && maxWeight) {
        query.payload_capacity = { $gte: minWeight, $lte: maxWeight };
    }

    if (hitchType) {
        query.hitch_type = hitchType;
    }
    if(category){
        query.category = category
    }
    if (location) {
        // Use a case-insensitive regex to search for the location in complete_address
        query.complete_address = { $regex: location, $options: 'i' };
    }

    try {
        // Fetch trailers matching the query
        const trailers = await Trailers.find(query);
        res.json(trailers);
    } catch (error) {
        console.error("Error fetching trailers:", error);
        res.status(500).json({ error: "Failed to fetch trailers" });
    }
}

module.exports = {

    userTrailerbyCategory,
    getcordinates,
    trailerSearch

};
