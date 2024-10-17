const express = require('express');
const dotenv = require('dotenv');
const { handleFormSubmission } = require('./googleFormHandler');
const { sendEmail } = require('./emailService');
const { startAutomation } = require('./automationService');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/form-submitted', async (req, res) => {
  // ... (previous code remains the same)
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log('Environment variables:');
  // console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
  // console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  // console.log('EMAIL_USER:', process.env.EMAIL_USER);
  // // Don't log the entire private key or email password for security reasons
  // console.log('GOOGLE_PRIVATE_KEY is set:', !!process.env.GOOGLE_PRIVATE_KEY);
  // console.log('EMAIL_PASS is set:', !!process.env.EMAIL_PASS);

  // Start the automation
  startAutomation(5000);  // Check every 60 seconds
});
