const cron = require('node-cron');
const { Bookings } = require('../models/bookings'); 
const { Finance } = require('../models/finance'); 

const updateFinance = async () => {
    try {
        const completedBookings = await Bookings.find({
            status: 'Completed',
            _id: { $nin: (await Finance.find({}).distinct('booking_id')) }
        });

        const financeData = completedBookings.map(booking => ({
            host_id: booking.host_id,
            booking_id: booking._id,
            host_price: booking.host_price,
            amount: booking.booking_amount,
            bambora_response: booking.bambora_response,
            status: 'In-Queue'
        }));

        if (financeData.length > 0) {
            await Finance.insertMany(financeData);
            console.log(`${financeData.length} finance records added.`);
        } else {
            console.log('No completed bookings to process.');
        }
    } catch (error) {
        console.error('Error updating finance schema:', error.message);
    }
};

const startCron = () => {
    cron.schedule('*/2 * * * *', updateFinance);
    console.log('Cron job set up to run every 2 minutes.');
};

module.exports = startCron;
