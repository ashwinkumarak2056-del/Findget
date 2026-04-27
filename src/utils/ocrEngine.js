import Tesseract from 'tesseract.js';
import { categorizeExpense } from './aiCategorizer';

export const extractReceiptData = async (imageFile, onProgress) => {
  try {
    // Tesseract.js v5+ recommended initialization
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        // Report progress for both loading and recognizing
        if (onProgress) {
          if (m.status === 'recognizing text') {
            onProgress(0.3 + (m.progress * 0.7)); // 30-100% for recognition
          } else {
            onProgress(0.1); // Initial loading state
          }
        }
      },
    });

    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();

    return parseReceiptText(text);
  } catch (error) {
    console.error("OCR Error:", error);
    // Fallback logic for demo if Tesseract fails in specific environments
    return {
      merchant: "Manual Entry Required",
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      gst: 0,
      paymentMode: "Unknown",
      category: "Miscellaneous",
      error: true
    };
  }
};

const parseReceiptText = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let merchant = 'Unknown Merchant';
  let date = new Date().toISOString().split('T')[0];
  let amount = 0;
  let gst = 0;
  let paymentMode = 'Cash';

  // 1. IMPROVED MERCHANT EXTRACTION
  // Usually the first 1-3 lines contain the merchant name.
  // We ignore lines that look like dates or amounts.
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    if (line.length > 3 && !/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/.test(line) && !/[\d\.]+/.test(line)) {
      merchant = line.replace(/[^a-zA-Z0-9\s&]/g, '').trim();
      break;
    }
  }

  // 2. MULTI-STRATEGY AMOUNT EXTRACTION
  const allAmounts = [];
  const amountKeywords = /total|grand total|payable|balance|due|net amount|subtotal|amount in rs|invoice total|amt/i;
  const currencyRegex = /(?:₹|\$|rs|inr|rp)?[\s]*?([\d,]+\.\d{2})/gi;
  const numericRegex = /([\d,]+\.\d{2})/g;

  let items = [];
  
  lines.forEach((line, index) => {
    // 1. ITEM EXTRACTION
    // Lines that have a quantity (like 1x or 2 ) and a price are likely items
    if (/(\d+)\s*x\s*|[\d\.]+\s*(?:pc|kg|gm|qty)/i.test(line) || (/[\d,]+\.\d{2}/.test(line) && line.length > 5 && index > 2 && index < lines.length - 3)) {
       const cleanItem = line.replace(/[\d,]+\.\d{2}/, '').replace(/₹|\$|rs|inr/i, '').trim();
       if (cleanItem.length > 2) items.push(cleanItem);
    }

    // 2. Strategy A: Keyword Match
    if (amountKeywords.test(line)) {
      const match = line.match(/([\d,]+\.\d{2})/);
      if (match) {
        const val = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(val)) allAmounts.push({ val, weight: 10, line: index });
      } else if (index < lines.length - 1) {
        // Check next line if keyword is alone
        const nextMatch = lines[index + 1].match(/([\d,]+\.\d{2})/);
        if (nextMatch) {
          const val = parseFloat(nextMatch[1].replace(/,/g, ''));
          if (!isNaN(val)) allAmounts.push({ val, weight: 8, line: index + 1 });
        }
      }
    }

    // Strategy B: Collect all valid-looking currency amounts
    let m;
    while ((m = numericRegex.exec(line)) !== null) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      if (!isNaN(val)) allAmounts.push({ val, weight: 1, line: index });
    }

    // 3. IMPROVED DATE EXTRACTION
    // Strategy A: Look for the word "Date" and capture the value next to it
    if (/date|dt|dated/i.test(line)) {
      const datePart = line.split(/date|dt|dated/i)[1];
      if (datePart) {
        const dMatch = datePart.match(/(\d{1,2}[\/\-\.](?:\d{1,2}|[A-Za-z]{3,9})[\/\-\.]\d{2,4})|(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/);
        if (dMatch) {
          date = dMatch[0].replace(/[\/\.]/g, '-');
        }
      }
    } else if (date === new Date().toISOString().split('T')[0]) {
      // Strategy B: General search if keyword strategy hasn't found anything yet
      const dateRegex = /(\d{1,2}[\/\-\.](?:\d{1,2}|[A-Za-z]{3})[\/\-\.]\d{2,4})|(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/;
      const dateMatch = line.match(dateRegex);
      if (dateMatch) {
        date = dateMatch[0].replace(/[\/\.]/g, '-');
      }
    }

    // 4. GST EXTRACTION
    if (/gst|tax|vat|cgst|sgst/i.test(line)) {
      const gMatch = line.match(/([\d,]+\.\d{2})/);
      if (gMatch) {
        const gVal = parseFloat(gMatch[1].replace(/,/g, ''));
        if (!isNaN(gVal)) gst += gVal;
      }
    }

    // 5. PAYMENT MODE
    if (/visa|master|card|debit|credit|xxxx/i.test(line)) paymentMode = 'Credit/Debit Card';
    if (/upi|gpay|paytm|phonepe|digital/i.test(line)) paymentMode = 'UPI/Digital';
  });

  // Pick the best amount logic remains...
  if (allAmounts.length > 0) {
    const validAmounts = allAmounts.filter(a => a.val > 0 && a.val < 10000000); 
    const grandTotalCandidates = validAmounts.filter(a => a.weight >= 8);
    if (grandTotalCandidates.length > 0) {
      grandTotalCandidates.sort((a, b) => b.line - a.line);
      amount = grandTotalCandidates[0].val;
    } else {
      const highest = [...validAmounts].sort((a, b) => b.val - a.val)[0];
      if (highest) amount = highest.val;
    }
  }

  if (gst > amount) gst = amount * 0.18;

  const category = categorizeExpense(merchant, items);

  return {
    merchant,
    date,
    amount: amount || 0,
    gst: gst || 0,
    paymentMode,
    category,
    items: items.slice(0, 5), // Return top 5 items
    rawText: text
  };
};
