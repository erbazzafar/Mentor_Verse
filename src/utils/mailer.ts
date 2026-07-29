import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import ForgotPasswordEmail from "../../emails/forgetPasswordEmail";
import { JSX } from "react";


type EmailType = "verification" | "forgot-password";

interface EmailOptions {
  email: string; // Recipient's email
  username: string; // Recipient's username
  otp: string; // One-time code or reset code
  type: EmailType; // Type of email to send
}

export async function sendEmail({
  email,
  username,
  otp,
  type,
}: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    // Determine the subject and template based on email type
    let subject: string;
    let template: JSX.Element;

    console.log("Sending email with options:", { email, username, otp, type });

    if (type === "verification") {
      subject = "MentorVerse Verification Code";
      template = VerificationEmail({ username, otp });
    } else if (type === "forgot-password") {
      subject = "MentorVerse Password Reset Code";
      template = ForgotPasswordEmail({ username, resetCode: otp });
    } else {
      throw new Error("Invalid email type");
    }

    // Send the email via Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject,
      react: template,
    });

    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
}
