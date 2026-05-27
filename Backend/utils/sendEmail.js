const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const port = parseInt(process.env.EMAIL_PORT, 10) || 465;

    // Puerto 465 → SSL directo (secure: true)
    // Puerto 587 → STARTTLS (secure: false)
    const secure = port === 465;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port,
        secure,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"GasConnect Soporte" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
