document.addEventListener('DOMContentLoaded', function () {
  const scrapeButton = document.getElementById('scrapeDataButton');
  const saveButton = document.getElementById('saveDataButton');

  let scrapedData = null;

  // Scrape Data Button
  scrapeButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, { action: 'scrapeData' }, function (response) {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
        } else if (response && response.data) {
          scrapedData = response.data;
          console.log('Scraped Data:', scrapedData);
          displayScrapedData(scrapedData);
        }
      });
    });
  });

  // Save to Google Sheets Button
  saveButton.addEventListener('click', function () {
    if (scrapedData) {
      chrome.runtime.sendMessage({ action: 'saveDataToSheet', data: scrapedData }, function (response) {
        if (response.success) {
          console.log('Data successfully saved to Google Sheets!');
        } else {
          console.error('Error saving data to Google Sheets:', response.error);
        }
      });
    } else {
      console.log('No data to save!');
    }
  });

  function displayScrapedData(data) {
    const displayArea = document.getElementById('displayArea');
    displayArea.innerHTML = '';
    for (const [key, value] of Object.entries(data)) {
      const row = document.createElement('div');
      row.innerHTML = `<strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> ${value}`;
      displayArea.appendChild(row);
    }
  }
});