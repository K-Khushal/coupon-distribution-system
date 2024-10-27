const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

async function sendEmail(formData)
{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const preferences = Object.entries(formData.preferences)
  .filter(([, value]) => value)
  .map(([key]) => key)
  .join(", ");

  const preferenceImages = {
    "19 Breakfast": "Images/19thBreakfast.png",
    "19 Lunch": "Images/19thLunch.png",
    "19 Dinner": "Images/19thDinner.png",
    "20 Breakfast": "Images/20thBreakfast.png",
    "20 Lunch": "Images/20thLunch.png",
    "20 Dinner": "Images/20thDinner.png"
  };

  const attachments = Object.entries(formData.preferences)
  .filter(([, value]) => value)
  .map(([key]) => ({
    filename: path.basename(preferenceImages[key]),
    path: preferenceImages[key]
  }));

  const mailOptions = {
    from: `"Saptrang ShortFest 2024" <${process.env.EMAIL_USER}>`,
    to: formData.email,
    subject: "You've got food coupon! | Saptrang ShortFest 2024",
    text: `
Thank you for registering for Saptrang Shorfest!

You have selected the following food coupons: ${preferences}

If you have any questions or need to make any changes, please feel free to contact us.

Your food coupons are attached for your reference.

Regards,
Saptrang Shorfest
    `,
    html: `
   <h1>Thank you for registering for Saptrang Shorfest!</h1>
   <p style="font-size: 18px;">You have selected the following food coupons:<strong>${preferences}</strong></p>
   <p style="font-size: 18px;">If you have any questions or need to make any changes, please feel free to contact us.</p>
   <p style="font-size: 18px;">Your food coupons are attached for your reference.</p>
   <p style="font-size: 18px;">Best regards,<br><strong>Saptrang Shorfest</strong></p>
       `,
    attachments: attachments
  };

  try {
      await transporter.sendMail(mailOptions);
      logEmail(formData.email, preferences);
    } catch (error) {
      console.error('Error sending email:', error.message);
      console.error('Stack trace:', error.stack);
    }
}

function logEmail(email) {
  const logEntry = `Email sent to: ${email}, Timestamp: ${new Date().toISOString()}\n`;
  fs.appendFile('email_log.txt', logEntry, (err) => {
    if (err) {
      console.error('Error logging email:', err.message);
    }
  });
}

module.exports = {sendEmail};
