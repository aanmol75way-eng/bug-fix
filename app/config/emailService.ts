import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'aanmol.75way@gmail.com',
        pass: 'yvyhqqfeqsubkpyw',
    },
});

export default transporter;
