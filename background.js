// Listener for messages from popup.js or content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveDataToSheet') {
    saveDataToSheet(message.data, sendResponse);
    return true; // Keep the message channel open for async response
  }
});

// Function to send data to Google Apps Script
function saveDataToSheet(data, callback) {
  const url = 'https://script.google.com/macros/s/AKfycbxg5R4N7m28AYKM5PUKY0HerZFfoFq39M5xHsEJ0QouuJQAqF-W5Qo7Pq8H-IxUipWvsQ/exec';

  const requestBody = {
    orderId: data.orderId,
    eventName: data.eventName,
    eventDate: data.eventDate,
    venue: data.venue,
    seats: data.seats,
    totalPrice: data.totalPrice,
    email: data.email,
    specialInfo: data.specialInfo,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then(response => {
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // If not JSON, throw an error with the response text
        return response.text().then(text => {
          throw new Error(`Unexpected response: ${text}`);
        });
      }
    })
    .then(result => {
      console.log('Data saved to Google Sheets:', result);
      if (result.error) {
        console.error('Google Sheets API error:', result.error);
        callback({ success: false, error: result.error.message });
      } else {
        callback({ success: true });
      }
    })
    .catch(error => {
      console.error('Error saving to Google Sheets:', error);
      callback({ success: false, error: error.message });
    });
}