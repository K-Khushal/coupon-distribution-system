const { handleFormSubmission } = require('./googleFormHandler');
const { sendEmail } = require('./emailService');

let lastProcessedRow = 0;

async function checkForNewResponses() {
  try {
    console.log('Checking for new responses...');
    const formData = await handleFormSubmission();

    if (formData.rowNumber > lastProcessedRow) {
      console.log(`New response found at row ${formData.rowNumber}. Sending email...`);
      await sendEmail(formData);
      console.log('Email sent successfully');
      lastProcessedRow = formData.rowNumber;
    } else {
      console.log('No new responses');
    }
  } catch (error) {
    console.error('Error in automation:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

function startAutomation(interval = 60000) {  // Default to checking every minute
  setInterval(checkForNewResponses, interval);
  console.log(`Automation started. Checking for new responses every ${interval / 1000} seconds.`);
}

module.exports = { startAutomation };
