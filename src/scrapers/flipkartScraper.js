const puppeteer = require('puppeteer');
const fs = require("fs/promises");

const scrapeFlipkart = async (query) => {
  if (!query) throw new Error("Missing search query");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  console.log('Navigating to URL:', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  console.log('Scraping started for query:', query);

  // Capture a screenshot for debugging
  await page.screenshot({ path: 'flipkart_debug_initial.png', fullPage: true });

  // Log the page content for inspection
  const pageContent = await page.content();
  console.log('Page Content Length:', pageContent.length);

  // Wait for the product container to load
  try {
    await page.waitForSelector('div[data-id]', { timeout: 10000 });
    console.log('Product container loaded successfully.');

    // Capture a screenshot after waiting for the product container
    await page.screenshot({ path: 'flipkart_debug_after_wait.png', fullPage: true });

    // Log the HTML content of the product container for inspection
    const containerContent = await page.evaluate(() => {
      const container = document.querySelector('div[data-id]');
      return container ? container.innerHTML : 'No container found';
    });
    console.log('Product Container Content:', containerContent);
  } catch (error) {
    console.error('Error: Product container did not load within the timeout period.');
    await browser.close();
    throw new Error('Page loading issue or anti-scraping measures detected.');
  }

  // Scrape product details
  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('div[data-id]').forEach((el) => {
      const name = el.querySelector('div.KzDlHZ')?.textContent.trim() || null; // Updated selector for product name
      const price = el.querySelector('div.Nx9bqj._4b5DiR')?.textContent.trim() || null; // Updated selector for product price
      const image = el.querySelector('img.DByuf4')?.getAttribute('src') || null; // Updated selector for product image
      const link = el.querySelector('a.CGtC98')?.href || null; // Updated selector for product link

      // Ensure the image URL is absolute
      const absoluteImage = image && image.startsWith('http') ? image : `https://rukminim2.flixcart.com${image}`;

      // Log intermediate values for debugging
      console.log('Product Details:', { name, price, image: absoluteImage, link });

      if (name && (price || absoluteImage || link)) {
        items.push({ name, price, image: absoluteImage, link });
      }
    });

    return items;
  });

  // Additional debugging log for scraped products
  console.log('Scraped products:', products);

  await browser.close();
  return products;
};

module.exports = scrapeFlipkart;
