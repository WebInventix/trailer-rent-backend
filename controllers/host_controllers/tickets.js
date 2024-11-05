const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Tickets} = require("../../models/tickets")

const addTicket = async (req,res) => {
    const {user_id} = req
    const {query,attachment} = req.body
    try {
        const ticket = new Tickets({user_id,query,attachment,status:'In-Process'})
        await ticket.save()
        res.status(201).json({message:"Ticket Added Successfully",ticket:ticket})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getTickets = async(req,res) => {
    const {user_id} = req
    try {
        const tickets = await Tickets.find({user_id:user_id})
        res.status(200).json({message:"fetched all tickets",tickets:tickets})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {
    addTicket,
    getTickets
};












