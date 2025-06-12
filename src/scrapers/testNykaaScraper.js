const nykaaScraper = require('./nykaaScraper');

(async () => {
  const query = 'Maybelline New York Super Stay Matte Ink Liquid Lipstick'; // Replace with your desired search query

  try {
    const productDetails = await nykaaScraper(query);
    console.log('Scraped Product Details:', productDetails);

    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();
