const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Tickets} = require("../../models/tickets")

const addTicket = async (req,res) => {
    const {user_id} = req
    const {query,attachment} = req.body
    try {
        const ticket = new Tickets({user_id,query,attachment})
        await ticket.save()
        res.status(201).json({message:"Ticket Added Successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {
    addTicket
};












