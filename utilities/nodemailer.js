const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD  
        }
    });
    let mailOptions = {
        from: {
            name: "Fastamoni-App",
            address: process.env.APP_EMAIL
        },
        to: options.email,
        subject: 'Thank You for Your Generous Donations!',
        message: `Dear ${user.firstname}, thank you for making multiple donations! We truly appreciate your support.`
    }
    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;