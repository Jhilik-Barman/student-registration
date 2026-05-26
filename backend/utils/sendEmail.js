const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

async function sendPaymentConfirmationEmail(student) {
  const mailOptions = {
    from: `"Corporates Guide" <${process.env.SENDER_EMAIL}>`,
    to: student.email,
    subject: "Payment Confirmation - Summer Internship 2026",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
          .header { background: #3b5bdb; padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .header p { color: #dbe4ff; margin: 8px 0 0; font-size: 14px; }
          .body { padding: 30px; }
          .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 16px; }
          .success-box { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; }
          .success-box p { color: #16a34a; font-size: 16px; font-weight: 700; margin: 0; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .details-table th { background: #3b5bdb; color: white; padding: 12px 16px; text-align: left; font-size: 14px; }
          .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #333; }
          .details-table tr:nth-child(even) td { background: #f8faff; }
          .details-table .label { color: #6b7280; font-weight: 500; width: 40%; }
          .fee-row td { background: #dbe4ff !important; font-weight: 700; color: #3b5bdb !important; font-size: 16px; }
          .footer { background: #f8faff; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { color: #6b7280; font-size: 12px; margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Corporates Guide</h1>
            <p>Summer Internship 2026 - Payment Confirmation</p>
          </div>
          <div class="body">
            <p class="greeting">Dear <strong>${student.fullName}</strong>,</p>
            <div class="success-box">
              <p>✅ Payment Received Successfully!</p>
            </div>
            <p style="color:#555; margin-bottom:16px;">Thank you for registering for the Summer Internship 2026. Here are your registration details:</p>
            <table class="details-table">
              <tr><th colspan="2">Registration Details</th></tr>
              <tr><td class="label">Full Name</td><td>${student.fullName}</td></tr>
              <tr><td class="label">College</td><td>${student.collegeName}</td></tr>
              <tr><td class="label">Roll Number</td><td>${student.rollNumber}</td></tr>
              <tr><td class="label">Email</td><td>${student.email}</td></tr>
              <tr><td class="label">Phone</td><td>${student.phone}</td></tr>
              <tr><td class="label">Stream</td><td>${student.stream}</td></tr>
              <tr><td class="label">Course</td><td>${student.courseName}</td></tr>
              <tr><td class="label">Mode</td><td>${student.mode === "online" ? "💻 Online" : "🏢 Offline"}</td></tr>
              <tr class="fee-row"><td class="label">Amount Paid</td><td>₹${student.fee}/-</td></tr>
            </table>
            <p style="color:#555; font-size:13px;">If you have any questions, please contact us at <a href="mailto:${process.env.SENDER_EMAIL}" style="color:#3b5bdb;">${process.env.SENDER_EMAIL}</a></p>
          </div>
          <div class="footer">
            <p><strong>Corporates Guide</strong></p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPaymentConfirmationEmail };