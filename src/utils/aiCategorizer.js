const categoryConfig = {
  Food: {
    keywords: ['restaurant', 'cafe', 'coffee', 'burger', 'pizza', 'grocery', 'supermarket', 'market', 'eats', 'doordash', 'uber eats', 'swiggy', 'zomato', 'starbucks', 'mcdonalds', 'whole foods', 'biryani', 'curry', 'dhaba', 'bakery', 'sweets', 'fruit', 'vegetable', 'milk', 'dairy', 'tiffin', 'dinner', 'lunch', 'breakfast', 'canteen', 'hotel', 'dining', 'kitchen'],
    items: ['bread', 'egg', 'meat', 'rice', 'dal', 'flour', 'oil', 'salt', 'sugar', 'juice', 'coke', 'pepsi', 'tea', 'chai', 'sandwich', 'pasta', 'maggi', 'noodle']
  },
  Transport: {
    keywords: ['uber', 'lyft', 'taxi', 'cab', 'transit', 'train', 'bus', 'flight', 'airline', 'fuel', 'gas', 'shell', 'chevron', 'parking', 'petrol', 'diesel', 'cng', 'auto rickshaw', 'metro', 'ola', 'rapido', 'indigo', 'air india', 'irctc', 'toll', 'fastag'],
    items: ['fare', 'ticket', 'distance', 'km', 'trip', 'ride', 'commute']
  },
  Shopping: {
    keywords: ['amazon', 'walmart', 'target', 'apparel', 'clothing', 'shoes', 'electronics', 'apple', 'best buy', 'flipkart', 'myntra', 'ajio', 'reliance digital', 'lifestyle', 'zara', 'h&m', 'mall', 'fashion', 'store', 'retail'],
    items: ['t-shirt', 'jeans', 'shirt', 'dress', 'mobile', 'laptop', 'headphone', 'watch', 'bag', 'toy', 'gift']
  },
  Utilities: {
    keywords: ['electricity', 'water', 'gas', 'internet', 'comcast', 'at&t', 'verizon', 't-mobile', 'pg&e', 'bill', 'mobile', 'recharge', 'bescom', 'bsnl', 'jio', 'airtel', 'vi ', 'broadband', 'act fibernet', 'power', 'utility'],
    items: ['topup', 'validity', 'plan', 'postpaid', 'prepaid', 'kw']
  },
  Entertainment: {
    keywords: ['netflix', 'spotify', 'hulu', 'disney+', 'cinema', 'movie', 'theater', 'ticket', 'event', 'game', 'steam', 'playstation', 'xbox', 'pvr', 'inox', 'bookmyshow', 'concert', 'pub', 'club', 'bar', 'lounge', 'brewery', 'ott'],
    items: ['popcorn', 'show', 'entry', 'drink', 'cocktail', 'beer']
  },
  Healthcare: {
    keywords: ['pharmacy', 'hospital', 'clinic', 'doctor', 'dental', 'cvs', 'walgreens', 'medical', 'health', 'apollo', 'medplus', 'practo', 'medicine', 'diagnostic', 'lab', 'dentist', 'eye', 'vision', 'physio'],
    items: ['tablet', 'capsule', 'syrup', 'test', 'scan', 'x-ray', 'consultation']
  },
  'Business Procurement': {
    keywords: ['staples', 'office depot', 'aws', 'gcp', 'azure', 'server', 'hosting', 'software', 'saas', 'subscription', 'hardware', 'component', 'bulk', 'wholesale', 'adobe', 'zoom', 'slack', 'notion', 'canva'],
    items: ['license', 'api', 'cloud', 'domain', 'stationery', 'paper']
  }
};

export const categorizeExpense = (merchant, items = []) => {
  const itemText = Array.isArray(items) ? items.join(' ') : items;
  const textToAnalyze = `${merchant} ${itemText}`.toLowerCase();
  
  const scores = {};
  Object.keys(categoryConfig).forEach(cat => scores[cat] = 0);

  for (const [category, config] of Object.entries(categoryConfig)) {
    // Score keywords (higher weight)
    config.keywords.forEach(kw => {
      if (textToAnalyze.includes(kw)) scores[category] += 5;
    });

    // Score specific items (medium weight)
    config.items.forEach(item => {
      if (textToAnalyze.includes(item)) scores[category] += 3;
    });
  }

  // Find category with highest score
  let bestCategory = 'Miscellaneous';
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Final heuristic overrides
  if (textToAnalyze.includes('hospital') || textToAnalyze.includes('clinic')) return 'Healthcare';
  if (textToAnalyze.includes('restaurant') || textToAnalyze.includes('foods')) return 'Food';
  if (textToAnalyze.includes('petrol') || textToAnalyze.includes('fuel')) return 'Transport';

  return bestCategory;
};
