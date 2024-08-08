import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "mail.inkypen.com.ng", // e.g., mail.yourdomain.com
    port: 465, // or 587
    secure: true, // true for 465, false for other ports
    auth: {
        user: "inkypenadmin@inkypen.com.ng", // Your cPanel email address
        pass: "InkypenAdmin", // Your cPanel email password
    },
});

// Function to send welcome email
export const sendloginEmail = (to, username) => {
    const mailOptions = {
        from: "inkypenadmin@inkypen.com.ng",
        to: to,
        subject: "Welcome to Our Community",
        html: `<P> Hello ${username},</p>
        \n\ <p>Welcome Back to <a href="https://inkypen.com.ng"> inkypen </a> writing community! It's good to know you are still with us</p>
        \n\ <p>Feel free to share your stories with us, and with the rest of the world.</p>
        \n\ <p>it is time to let your creativity flow on ink and to use your pen to make magic!</p> 
        \n\<p>Best regards,<p>
        \n\ <a href="https://inkypen.com.ng">inkypen Team </a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};