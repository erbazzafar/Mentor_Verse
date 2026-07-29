import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import { sendEmail } from "@/utils/mailer";
import { NextResponse } from "next/server";

// Helper function to create error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Helper function to generate a random verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code, action } = await request.json();

    console.log("username", username);
    console.log("code", code);

    // Validate input
    if (!username) {
      return createErrorResponse("Username is required");
    }

    const user = await UserModel.findOne({ username });
    console.log("user", user);

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    if (action === "verify") {
      console.log("verify", code);
      // Handle email verification
      if (!code) {
        return createErrorResponse("Verification code is required", 400);
      }

      if (
        user.verifyEmailCode !== code ||
        !user.verifyEmailCodeExpiry ||
        user.verifyEmailCodeExpiry < new Date()
      ) {
        return createErrorResponse("Invalid or expired verification code", 400);
      }


      // Mark the user as verified and clear verification fields
      user.isVerified = true;

      await user.save();
      console.log("user saved", user);

      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    } else if (action === "resend") {
      // Handle resending the verification code
      if (user.isVerified) {
        return createErrorResponse("User is already verified", 400);
      }

      const newCode = generateVerificationCode();
      const newExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      user.verifyEmailCode = newCode;
      user.verifyEmailCodeExpiry = newExpiry;
      await user.save();

      const emailResponse = await sendEmail({
        email: user.email,
        username: user.username,
        otp: newCode,
        type: "verification",
      });
      console.log("emailResponse", emailResponse);

      if (!emailResponse.success) {
        return createErrorResponse(emailResponse.message, 500);
      }

      return NextResponse.json({
        success: true,
        message: "Verification code sent successfully",
      });
    } else {
      return createErrorResponse("Invalid action", 400);
    }
  } catch (error) {
    console.error("Error handling verification or resend:", error);
    return createErrorResponse("Internal server error", 500);
  }
}





// import dbConnect from "@/lib/dbConfig";
// import UserModel from "@/models/user.model";
// import { NextResponse } from "next/server";

// // Helper function to create error response
// function createErrorResponse(message: string, status = 400) {
//   return NextResponse.json({ success: false, message }, { status });
// }

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const { username, code } = await request.json();

//     // Validation
//     if (!username || !code) {
//       return createErrorResponse("Email and verification code are required");
//     }

//     const normalizedEmail = username.toLowerCase();
//     const user = await UserModel.findOne({ username });

//     if (!user) {
//       return createErrorResponse("User not found", 404);
//     }

//     // Check if user is already verified
//     if (user.isVerified) {
//       return createErrorResponse("User is already verified", 400);
//     }

//     // Check if the verification code matches and is not expired
//     if (
//       user.verifyEmailCode !== code ||
//       !user.verifyEmailCodeExpiry ||
//       user.verifyEmailCodeExpiry < new Date()
//     ) {
//       return createErrorResponse("Invalid or expired verification code", 400);
//     }

//     // Mark the user as verified and clear verification fields
//     user.isVerified = true;
//     user.verifyEmailCode = null;
//     user.verifyEmailCodeExpiry = null;

//     await user.save();

//     return NextResponse.json({
//       success: true,
//       message: "Email verified successfully",
//     });
//   } catch (error) {
//     console.error("Error verifying user:", error);
//     return createErrorResponse("Error verifying user", 500);
//   }
// }
