import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Please click the link below to verify your email:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
    });
  }
}
