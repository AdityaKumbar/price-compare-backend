const express = require('express');
const router = express.Router();
const {
  scrapeNykaa,
  scrapeAmazon,
  scrapeFlipkart,
  scrapeMyntra,
  scrapeCroma,
  scrapeZomato,
  scrapeSwiggy,
  searchAllPlatforms
} = require('../controllers/scrapersController');

// Define routes for each scraper
router.get('/nykaa', scrapeNykaa);
router.get('/amazon', scrapeAmazon);
router.get('/flipkart', scrapeFlipkart);
router.get('/myntra', scrapeMyntra);
router.get('/croma', scrapeCroma);
router.get('/zomato', scrapeZomato);
router.get('/swiggy', scrapeSwiggy);
router.get('/search-all', searchAllPlatforms); // New route for searching across all platforms

module.exports = router;
