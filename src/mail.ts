import dotenv from "dotenv";
dotenv.config();

const { MAIL_ID, MAIL_KEY } = process.env;
import nodemailer from "nodemailer";

export class emailCheck {
  static sendTemplateToEmail = async (
    email: string,
    title: string,
    body: string
  ) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: MAIL_ID, // generated ethereal user
        pass: MAIL_KEY, // generated ethereal password
      },
    });

    await transporter.sendMail({
      from: `toyDeliveryWeb <${MAIL_ID}>`,
      to: email,
      subject: title,
      html: body,
    });
  };
}
