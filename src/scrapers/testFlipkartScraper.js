const flipkartScraper = require('./flipkartScraper');

(async () => {
  const query = 'laptop'; // Replace with your desired search query

  try {
    const productDetails = await flipkartScraper(query);
    console.log('Scraped Product Details:', productDetails);
  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();
