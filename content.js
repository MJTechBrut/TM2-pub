// Scrape the relevant data from the page
function scrapeData() {
  const orderIdElement = document.querySelector('div[data-tid="order-number"]');
  const orderId = orderIdElement
    ? orderIdElement.innerText.replace(/Order #:\s*/i, "").trim()
    : "N/A";

  const eventNameElement = document.querySelector('div[data-tid="event-name"]');
  const eventName = eventNameElement ? eventNameElement.innerText : "N/A";

  const eventDateElement = document.querySelector('div[class="style__EventDate-sc-18o9rta-5 eELNMU"]');
  const eventDate = eventDateElement ? eventDateElement.innerText : "N/A";

  const venueElement = document.querySelector('div[data-tid="event-venue"]');
  const venue = venueElement ? venueElement.innerText : "N/A";

  const seatsElement = document.querySelector('div[data-tid="seat-section"]');
  const seats = seatsElement ? seatsElement.innerText : "N/A";

  const totalPriceElement = document.querySelector('div[data-tid="summary-grand-total-price"]');
  const totalPrice = totalPriceElement ? totalPriceElement.innerText : "N/A";

  const emailElement = document.querySelector('div[data-tid="email-message"]');
  const email = emailElement
    ? emailElement.innerText.replace(/Order details emailed to\s*/i, "").trim()
    : "N/A";

  const specialInfoElement = document.querySelector('div[class="style__SecNameViewContainer-sc-obbmhz-7 elTDph"]');
  let specialInfo = specialInfoElement
    ? specialInfoElement.innerText
    : "N/A";

  // Clean up the special info
  specialInfo = specialInfo
    .replace(/^Ticket Information,\s*/i, "")  // Remove "Ticket Information,"
    .replace(/\s*\n\s*/g, ", ")               // Replace newlines with ", "
    .trim();

  // Log all the scraped data to the console
  console.log("Scraped Data:");
  console.log("Order ID:", orderId);
  console.log("Event Name:", eventName);
  console.log("Event Date:", eventDate);
  console.log("Venue:", venue);
  console.log("Seats:", seats);
  console.log("Total Price:", totalPrice);
  console.log("Email:", email);
  console.log("Special Info:", specialInfo);

  return {
    orderId,
    eventName,
    eventDate,
    venue,
    seats,
    totalPrice,
    email,
    specialInfo
  };
}

// Wait for the message to scrape data before triggering the function
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'scrapeData') {
    const data = scrapeData();
    sendResponse({status: 'scraping completed', data: data});
  }
});
