const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Resend } = require("resend");

async function sendOTP(email, otp) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: "Flight_Management <connect@dharmik.live>",
    to: [email],
    subject: `Your OTP for Flight Management`,
    html: `<h2>
    Dear Customer,
    We are welcoming you!
    To proceed with your request, please use the One-Time Password (OTP) provided below:
    Your OTP: ${otp}

    This OTP is valid for a 10 Minutes. Please do not share it with anyone for security reasons.
    Thank you for choosing Flight Management.

    Warm regards,
    Flight Management Team
    connect@dharmik.live</h2>`,
  });

  if (error) {
    console.error("Error sending OTP:", error);
    throw new Error(error.message || "Failed to send OTP");
  }

  return data;
}




module.exports = { sendOTP }; 
