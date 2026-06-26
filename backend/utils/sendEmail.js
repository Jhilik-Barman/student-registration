const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

async function sendRegistrationReceivedEmail(student) {
  const mailOptions = {
    from: `"Corporates Guide" <${process.env.SENDER_EMAIL}>`,
    to: student.email,
    subject: "Registration Received",
    html: `
      <p>Dear ${student.fullName},</p>
      <p>Thank you for submitting your registration and payment details. We have received your payment screenshot. Our team will verify your payment within <strong>24 hours</strong>. You will receive another email once the payment is confirmed.</p>
      <p>Regards,<br/>Corporates Guide</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

async function sendPaymentSuccessfulEmail(student) {
  const mailOptions = {
    from: `"Corporates Guide" <${process.env.SENDER_EMAIL}>`,
    to: student.email,
    subject: "Payment Successful",
    html: `
      <p>Dear ${student.fullName},</p>
      <p>Congratulations! Your payment has been successfully verified. Your registration is now complete, and you can proceed with the next steps.</p>
      <p>Regards,<br/>Corporates Guide</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

async function sendPaymentRejectedEmail(student) {
  const mailOptions = {
    from: `"Corporates Guide" <${process.env.SENDER_EMAIL}>`,
    to: student.email,
    subject: "Payment Verification Failed",
    html: `
      <p>Dear ${student.fullName},</p>
      <p>We could not verify your payment successfully. Please upload a valid payment screenshot again so we can complete your registration.</p>
      <p>Regards,<br/>Corporates Guide</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendRegistrationReceivedEmail,
  sendPaymentSuccessfulEmail,
  sendPaymentRejectedEmail,
};