const puppeteer = require('puppeteer');

const scrapeCroma = async (query) => {
  if (!query) throw new Error("Missing search query");

  const browser = await puppeteer.launch({
    headless: false,
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

  const url = `https://www.croma.com/search/?text=${encodeURIComponent(query)}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Give the client-side scripts time to render (can adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Scrape product cards
  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('.product-item').forEach((el) => {
      const name = el.querySelector('.product-title')?.innerText || 'No name';
      const price = el.querySelector('.amount')?.innerText || 'No price';
      const image = el.querySelector('img')?.src || '';
      const link = el.querySelector('a')?.href || '';

      items.push({ name, price, image, link });
    });

    return items;
  });

  await browser.close();
  return products;
};

module.exports = scrapeCroma;
