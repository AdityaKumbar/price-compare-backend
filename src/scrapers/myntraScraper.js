const puppeteer = require('puppeteer');

const scrapeMyntra = async (query) => {
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

  const url = `https://www.myntra.com/${encodeURIComponent(query)}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Give the client-side scripts time to render (can adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Add a delay outside the page.evaluate function to ensure images are loaded
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Adjust the selector to match the correct product container
  await page.waitForSelector('.product-base', { timeout: 15000 });

  // Scrape product cards
  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('.product-base').forEach((el) => {
      const name = el.querySelector('.product-product')?.innerText.trim() || 'No name';
      const brand = el.querySelector('.product-brand')?.innerText.trim() || 'No brand';
      const price = el.querySelector('.product-discountedPrice')?.innerText.trim() || 'No price';
      const image = el.querySelector('img')?.src || 'No image';
      const link = el.querySelector('a')?.href || 'No link';

      items.push({ name: `${brand} ${name}`, price, image, link });
    });

    return items;
  });

  console.log('Scraped products from Myntra:', products);

  await browser.close();
  return products;
};

module.exports = scrapeMyntra;
