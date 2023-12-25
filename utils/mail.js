import nodemailer from 'nodemailer';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME, // Replace with your Gmail address
    pass: process.env.GMAIL_PASSWORD // Replace with your Gmail password or app password
  }
});

// Send email function
async function sendEmail(to, subject, text, html) {
  let mailOptions = {
    from: process.env.GMAIL_USERNAME, // Replace with your Gmail address
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

export default sendEmail;
