const nykaaScraper = require('../scrapers/nykaaScraper');
const amazonScraper = require('../scrapers/amazonScraper');
const flipkartScraper = require('../scrapers/flipkartScraper');
const myntraScraper = require('../scrapers/myntraScraper');
const cromaScraper = require('../scrapers/cromaScraper');
const zomatoScraper = require('../scrapers/zomatoScraper');
const swiggyScraper = require('../scrapers/swiggyScraper');

// Controller functions for each scraper
const scrapeNykaa = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await nykaaScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Nykaa', error });
  }
};

const scrapeAmazon = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await amazonScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Amazon', error });
  }
};

const scrapeFlipkart = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await flipkartScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Flipkart', error });
  }
};

const scrapeMyntra = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await myntraScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Myntra', error });
  }
};

const scrapeCroma = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await cromaScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Croma', error });
  }
};

const scrapeZomato = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await zomatoScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Zomato', error });
  }
};

const scrapeSwiggy = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await swiggyScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Swiggy', error });
  }
};

const searchAllPlatforms = async (req, res) => {
  try {
    const { platform, query } = req.query;

    console.log('=== searchAllPlatforms Called ===');
    console.log('Platform:', platform);
    console.log('Query:', query);

    if (!query) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    let results = [];

    if (platform === 'amazon') {
      // If the clicked product is from Amazon, search Flipkart
      results = await flipkartScraper(query).catch(err => {
        console.error('Flipkart scraper error:', err);
        return [];
      });
    } else if (platform === 'flipkart') {
      // If the clicked product is from Flipkart, search Amazon
      results = await amazonScraper(query).catch(err => {
        console.error('Amazon scraper error:', err);
        return [];
      });
    } else if (platform === 'myntra') {
      // If the clicked product is from Myntra (beauty), search Nykaa
      console.log('Beauty: Clicked Myntra, scraping Nykaa');
      results = await nykaaScraper(query).catch(err => {
        console.error('Nykaa scraper error:', err);
        return [];
      });
    } else if (platform === 'nykaa') {
      // If the clicked product is from Nykaa (beauty), search Myntra
      console.log('Beauty: Clicked Nykaa, scraping Myntra');
      results = await myntraScraper(query).catch(err => {
        console.error('Myntra scraper error:', err);
        return [];
      });
    } else if (platform === 'beauty') {
      // (Legacy) If the clicked product is from the Beauty category, search both Myntra and Nykaa
      console.log('Legacy beauty block: scraping both Myntra and Nykaa');
      const myntraResults = await myntraScraper(query).catch(err => {
        console.error('Myntra scraper error:', err);
        return [];
      });
      const nykaaResults = await nykaaScraper(query).catch(err => {
        console.error('Nykaa scraper error:', err);
        return [];
      });
      results = [...myntraResults, ...nykaaResults];
    } else {
      console.log('Unsupported platform:', platform);
      return res.status(400).json({ message: 'Unsupported platform' });
    }

    console.log('Scraping results:', results);
    res.status(200).json({ otherPlatform: results });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  scrapeNykaa,
  scrapeAmazon,
  scrapeFlipkart,
  scrapeMyntra,
  scrapeCroma,
  scrapeSwiggy,
  scrapeZomato,
  searchAllPlatforms
};
