const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function handleFormSubmission() {
  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ];

  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);

  await doc.loadInfo();
  console.log(`Loaded doc: ${doc.title}`);
  const sheet = doc.sheetsByIndex[0];
  console.log(`Accessed sheet: ${sheet.title}`);

  // Load the header row
  await sheet.loadHeaderRow();
  const headers = sheet.headerValues;
  console.log('Sheet headers:', headers);

  // Load all rows
  const rows = await sheet.getRows();
  console.log(`Number of rows: ${rows.length}`);

  if (rows.length === 0) {
    throw new Error('The sheet is empty');
  }

  const latestSubmission = rows[rows.length - 1];
  console.log('Latest submission raw data:', latestSubmission._rawData);
  console.log('Latest submission properties:', Object.keys(latestSubmission));

  // Create an object mapping header names to values
  const submissionData = {};
  headers.forEach((header, index) => {
    submissionData[header] = latestSubmission._rawData[index];
  });

  console.log('Mapped submission data:', submissionData);

  if (!submissionData['Meal Preference']) {
    throw new Error("'Meal Preference' column not found or empty in the latest submission");
  }

  const mealPreferences = submissionData['Meal Preference'].split(', ');

  return {
    rowNumber: latestSubmission.rowNumber,
    timestamp: submissionData['Timestamp'] || 'N/A',
    email: submissionData['Email address'] || 'N/A',
    preferences: {
      '19 Breakfast': mealPreferences.includes('19 Breakfast'),
      '19 Lunch': mealPreferences.includes('19 Lunch'),
      '19 Dinner': mealPreferences.includes('19 Dinner'),
      '20 Breakfast': mealPreferences.includes('20 Breakfast'),
      '20 Lunch': mealPreferences.includes('20 Lunch'),
      '20 Dinner': mealPreferences.includes('20 Dinner'),
    }
  };
}

module.exports = { handleFormSubmission };
