const puppeteer = require('puppeteer');

const scrapeNykaa = async (query) => {
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

  const url = `https://www.nykaa.com/search/result/?q=${encodeURIComponent(query)}`;
  console.log('Navigating to URL:', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Check for login modal and close it if it appears
  try {
    await page.waitForSelector('.login-modal', { timeout: 5000 });
    console.log('Login modal detected. Attempting to close it with Escape key.');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1500); // Wait for modal to close
  } catch (error) {
    console.log('No login modal detected.');
  }

  // Give the client-side scripts time to render (can adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 5000)); // Adjusted wait time from 2000ms to 5000ms

  // Debugging: Log the page content to verify if product cards are present
  const pageContent = await page.content();
  console.log('Page Content Length:', pageContent.length);
  console.log('Page Content Snippet:', pageContent.slice(0, 500)); // Log a snippet of the page content

  // Capture a screenshot after navigating to the product page
  await page.screenshot({ path: 'nykaa_debug_product_page.png', fullPage: true });

  // Adjust the selector to match the correct product container
  await page.waitForSelector('.css-qlopj4', { timeout: 15000 });

  // Scrape product cards
  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('.css-qlopj4').forEach((el) => {
      const name = el.querySelector('.css-xrzmfa')?.innerText.trim() || 'No name';
      const price = el.querySelector('.css-111z9ua')?.innerText.trim() || 'No price';
      const image = el.querySelector('img.css-11gn9r6')?.src || 'No image';
      const link = el.href || 'No link';

      items.push({ name, price, image, link });
    });

    return items;
  });

  console.log('Scraped products from Nykaa:', products);

  await browser.close();
  return products;
};

module.exports = scrapeNykaa;
