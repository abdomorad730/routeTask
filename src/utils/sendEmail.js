import nodemailer from "nodemailer";

export const sendEmail = async (to, code) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const info = await transporter.sendMail({
            from: `"Route Academy 👨‍💻" <${process.env.EMAIL}>`,
            to,
            subject: "Verification Code",
            text: `Your verification code is: ${code}`,
            html: `<div style="font-family: sans-serif; font-size: 16px;">
                <p>Hello 👋,</p>
                <p>Your verification code is:</p>
                <h2 style="color: #007bff">${code}</h2>
                <p>This code will expire in 10 minutes.</p>
             </div>`,
        });

        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error.message);
        return false;
    }
};
