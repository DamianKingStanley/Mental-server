import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "mail.inkypen.com.ng", // e.g., mail.yourdomain.com
    port: 465, // or 587
    secure: true, // true for 465, false for other ports
    auth: {
        user: "inkypenadmin@inkypen.com.ng", // Your cPanel email address
        pass: "InkypenAdmin", // Your cPanel email password
    },
});