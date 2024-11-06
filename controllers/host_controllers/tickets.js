const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Tickets} = require("../../models/tickets")
const { generateOtp } = require("../../utils/generate_OTP");

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
    const {user_id,user_data} = req
    try {
        var tickets;
        if(user_data.role=="Admin")
        {
            tickets = await Tickets.find().populate('user_id').populate('comments.commented_by')
        }
        else
        {
            tickets = await Tickets.find({user_id:user_id}).populate('user_id').populate('comments.commented_by')
        }
        
        res.status(200).json({message:"fetched all tickets",tickets:tickets})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const viewTicket = async(req,res) => {
    const {ticket_id} = req.params
    try {
        const ticket = await Tickets.findById(ticket_id).populate('user_id', 'first_name last_name email').populate('comments.commented_by', 'first_name email first_name');
        res.status(200).json({message:"fetched ticket",ticket:ticket})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

const addComment = async (req,res) => {
    const {user_id} = req
    const { ticket_id, comment } = req.body;
    try {
        // Find the ticket by ID
        const ticket = await Tickets.findById(ticket_id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        // Create a new comment
        const newComment = {
            comment,
            commented_by: user_id,
            created_at: new Date()
        };

        // Add the comment to the ticket
        ticket.comments.push(newComment);

        // Save the updated post
        await ticket.save();
        let  completePost = await Tickets.findById(ticket_id).populate('user_id', 'first_name last_name email').populate('comments.commented_by', 'first_name email first_name');
        res.status(200).json({ success: true, message: 'Comment added successfully', completePost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding comment', error });
    }
}

const updateStatus = async (req,res) => {
    const {ticket_id} = req.params
    const {status} = req.body
    try {
        const ticket = await Tickets.findById(ticket_id)
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found'})
            }
            ticket.status = status
            await ticket.save()
            return res.status(200).json({ success: true, message: 'Ticket status updated successfully',ticket:ticket})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
module.exports = {
    addTicket,
    getTickets,
    viewTicket,
    addComment,
    updateStatus
};












