const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  //   ///////////////////////////////
  //   //   Send using gmail
  //   const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //     // Activate in gmail "less secure app" option
  //   });
  //   ///////////////////////////////
  //   Send using mailtrap
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define the email options
  const mailOptions = {
    from: 'Natours App',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
