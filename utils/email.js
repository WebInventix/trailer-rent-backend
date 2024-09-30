const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port:587,
  auth: {
    user: process.env.MAIL_USERNAME, // Your Gmail address
    pass: process.env.MAIL_PASSWORD, // Your Gmail password or app-specific password
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendverficationCode = async (to, code,code2) => {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject: 'Welcome to Our Service',
      text: `Your email verifiction code is ${code} and your mobile verification code is ${code2}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}: `, error);
    }
  };
  

  const forgotOtp = async (to, code) => {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject: 'Password Reset Req',
      text: `Your OTP Verfication Code is ${code}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}: `, error);
    }
  };
  
  module.exports = { sendverficationCode,forgotOtp };