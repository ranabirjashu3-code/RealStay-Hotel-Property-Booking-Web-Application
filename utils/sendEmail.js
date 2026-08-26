const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, verificationLink) => {
    await transporter.sendMail({
        from: `"RealStay" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your RealStay account",

        html: `
            <h2>Welcome to RealStay!</h2>

            <p>Thank you for creating your RealStay account.</p>

            <p>Please verify your email address:</p>

            <a href="${verificationLink}">
                Verify Email
            </a>

            <p>This link will expire in 15 minutes.</p>

            <p>If you did not create this account, you can ignore this email.</p>
        `
    });
};

module.exports = sendVerificationEmail;