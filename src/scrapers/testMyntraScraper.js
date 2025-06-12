const scrapeMyntra = require('./myntraScraper');

(async () => {
  try {
    const query = 'lipstick'; // Example query for beauty products
    const results = await scrapeMyntra(query);
    console.log('Myntra Scraper Results:', results);
  } catch (error) {
    console.error('Error during Myntra scraping:', error);
  }
})();
