const nodemailer = require("nodemailer");

const sendOtpToMail = async (email, otp) => {
  try {
    // Create a transporter object to send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can change this to any email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Send OTP via email
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Verification',
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>OTP Verification</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 30px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
                .header {
                  text-align: center;
                  color: #2d3748;
                  margin-bottom: 20px;
                }
                .header h1 {
                  font-size: 28px;
                  font-weight: bold;
                  color: #2c3e50;
                  margin-bottom: 10px;
                }
                .header p {
                  font-size: 16px;
                  color: #7f8c8d;
                }
               .otp-container {
                  display: inline-block;
                  background-color: #4caf50;
                  color: white;
                  font-size: 36px;
                  font-weight: bold;
                  max-width: 400px;
                  width: 100%;
                  padding: 13px;
                  border-radius: 8px;
                  margin: 15px auto;
                  text-align: center;
                }
                .otp-container strong {
                  font-size: 48px;
                  letter-spacing: 2px;
                }
                .info {
                  font-size: 16px;
                  color: #7f8c8d;
                  margin-top: 15px;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 14px;
                  color: #7f8c8d;
                }
                .footer a {
                  color: #4caf50;
                  text-decoration: none;
                }
                @media (max-width: 480px) {
                  .otp-container {
                    font-size: 28px;
                    padding: 10px;
                  }
                  .otp-container strong {
                    font-size: 36px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Builders And Tradies</h1>
                  <p>We’re excited to have you with us!</p>
                </div>
                
                <!-- OTP Section -->
                <div class="otp-container">
                  <span>Your OTP:</span>
                  <strong>${otp}</strong>
                </div>
      
                <p class="info">
                  Your OTP is valid for 1 hour. Please enter it to verify your account.
                </p>
      
                <!-- Footer -->
                <div class="footer">
                  <p>If you didn’t request this, please ignore this email or <a href="#">contact support</a>.</p>
                  <p>&copy; 2025 Builders And Tradies. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };
      
    await transporter.sendMail(mailOptions);
    // console.log('OTP sent to:', email);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP");
  }
};

module.exports = { sendOtpToMail };
