import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"GlobeTrotter" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for GlobeTrotter Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 24px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 32px; border-radius: 10px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);">
          <h2 style="color: #333333; text-align: center;">🔐 Verify Your Email</h2>
          <p style="font-size: 16px; color: #444444;">
            Hello,
          </p>
          <p style="font-size: 16px; color: #444444;">
            Thank you for joining <strong>GlobeTrotter</strong> — a platform where users can plan their tours.
            To continue, please use the following One-Time Password (OTP) to verify your email:
          </p>
          <p style="font-size: 36px; font-weight: bold; text-align: center; letter-spacing: 6px; color: #007bff; margin: 32px 0;">
            ${otp}
          </p>
          <p style="font-size: 16px; color: #444444;">
            This OTP is valid for <strong>5 minutes</strong>. Please enter it soon to complete your sign-up.
          </p>
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 14px; color: #999999; text-align: center;">
            Didn’t request this email? No worries — just ignore it.
          </p>
        </div>
      </div>
    `,
  });
};
