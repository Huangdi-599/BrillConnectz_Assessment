const nodemailer = require('nodemailer');

const emailService = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email id
      pass: process.env.EMAIL_PASSWORD, // Your password
    },
  }),

  sendEmail: async function({ to, subject, text, html }) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: to, 
      subject: subject,
      text: text, 
      html: html,
    };

    try {
      let info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw error; 
    }
  },
};

module.exports = emailService;
