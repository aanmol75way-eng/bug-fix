import nodemailer from "nodemailer";
import transporter from "./emailService";

export const sendVerificationEmail = async (
    to: string,
    verifyLink: string
): Promise<void> => {
    await transporter.sendMail({
        from: '"Auth App" <aanmol.75way@gmail.com>',
        to,
        subject: "Verify your email",
        html: `
      <h3>Email Verification</h3>
      <p>Click below to verify your email:</p>
      <a href="${verifyLink}">Verify Email</a>
    `,
    });
};
