const nykaaScraper = require('./nykaaScraper');
const amazonScraper = require('./amazonScraper');
const flipkartScraper = require('./flipkartScraper');
const myntraScraper = require('./myntraScraper');
const cromaScraper = require('./cromaScraper');
const zomatoScraper = require('./zomatoScraper');
const swiggyScraper = require('./swiggyScraper');

(async () => {
  const queries = {
    nykaa: 'Maybelline New York Super Stay Matte Ink Liquid Lipstick',
    amazon: 'smartphone',
    flipkart: 'laptop',
    myntra: 't-shirt',
    croma: 'refrigerator',
    zomato: 'pizza',
    swiggy: 'burger',
  };

  try {
    console.log('Testing Nykaa Scraper...');
    const nykaaResults = await nykaaScraper(queries.nykaa);
    console.log('Nykaa Results:', nykaaResults);

    console.log('Testing Amazon Scraper...');
    const amazonResults = await amazonScraper(queries.amazon);
    console.log('Amazon Results:', amazonResults);

    console.log('Testing Flipkart Scraper...');
    const flipkartResults = await flipkartScraper(queries.flipkart);
    console.log('Flipkart Results:', flipkartResults);

    console.log('Testing Myntra Scraper...');
    const myntraResults = await myntraScraper(queries.myntra);
    console.log('Myntra Results:', myntraResults);

    console.log('Testing Croma Scraper...');
    const cromaResults = await cromaScraper(queries.croma);
    console.log('Croma Results:', cromaResults);

    console.log('Testing Zomato Scraper...');
    const zomatoResults = await zomatoScraper(queries.zomato);
    console.log('Zomato Results:', zomatoResults);

    console.log('Testing Swiggy Scraper...');
    const swiggyResults = await swiggyScraper(queries.swiggy);
    console.log('Swiggy Results:', swiggyResults);
  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();
