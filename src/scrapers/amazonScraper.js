const puppeteer = require('puppeteer');

const scrapeAmazon = async (query) => {
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

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.google.com/',
    'DNT': '1', // Do Not Track
  });


  // Add additional headers to mimic a real browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Log the page content for debugging
  const pageContent = await page.content();
  console.log('Page content loaded:', pageContent.slice(0, 500)); // Log first 500 characters

  // Give the client-side scripts time to render (can adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Updated selector for product names
  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('div[data-asin]').forEach((el) => {
      const name = el.querySelector('h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal')?.textContent.trim() || null; // Extract product name
      const priceSymbol = el.querySelector('.a-price-symbol')?.textContent.trim() || 'Rs'; // Default to Rs if missing
      const priceWhole = el.querySelector('.a-price-whole')?.textContent.trim() || null;
      const price = priceWhole ? `${priceSymbol} ${priceWhole}` : null; // Combine symbol and price
      const image = el.querySelector('img')?.getAttribute('src') ||
                    el.querySelector('img')?.getAttribute('data-src') ||
                    el.querySelector('img')?.getAttribute('data-image-src') ||
                    el.querySelector('img')?.getAttribute('data-old-hires') || null; // Extract image
      const link = el.querySelector('a')?.href || null; // Extract product link

      // Ensure the image URL is valid and absolute
      const absoluteImage = image && image.startsWith('http') ? image : (image ? `https://www.amazon.in${image}` : null);

      // Log intermediate values for debugging
      if (!price || !image) {
        console.log('Debugging Missing Data:', {
          rawHTML: el.innerHTML,
          name,
          price,
          image,
          link
        });
      }

      if (name && (price || absoluteImage || link)) {
        items.push({ name, price, image: absoluteImage, link });
      }
    });

    return items;
  });

  console.log('Scraped products:', products);

  await browser.close();
  return products;
};

module.exports = scrapeAmazon;
