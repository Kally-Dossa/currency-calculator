const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../data/authMiddleware");

const router = express.Router();

// Path to the currencies.json file
const dataPath = path.join(__dirname, "../data/currencies.json");

// Helper functions to read and write data
const readData = () => JSON.parse(fs.readFileSync(dataPath));
const writeData = (data) =>
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// --- CRUD Operations ---

// GET all currencies and their exchange rates
router.get("/currencies", (req, res) => {
  const data = readData();
  res.json(data);
});
// Protected GET request for currencies (requires authentication)
router.get("/", authMiddleware, (req, res) => {
  const data = readData();
  res.json(data);
});
// POST add or update a currency and its rates
router.post("/", authMiddleware, (req, res) => {
  const { baseCurrency, rates } = req.body;

  if (!baseCurrency || !rates) {
    return res
      .status(400)
      .json({ message: "Base currency and rates are required." });
  }

  const data = readData();
  data[baseCurrency] = { ...data[baseCurrency], ...rates };
  writeData(data);

  res
    .status(201)
    .json({ message: "Currency added/updated successfully.", data });
});

// PUT update a specific exchange rate
router.put("/:baseCurrency/:targetCurrency", authMiddleware, (req, res) => {
  const { baseCurrency, targetCurrency } = req.params;
  const { rate } = req.body;

  if (!rate) {
    return res.status(400).json({ message: "Rate is required." });
  }

  const data = readData();

  if (!data[baseCurrency]) {
    return res.status(404).json({ message: "Base currency not found." });
  }

  data[baseCurrency][targetCurrency] = rate;
  writeData(data);

  res.json({
    message: `Rate updated for ${baseCurrency} to ${targetCurrency}.`,
    data,
  });
});

// DELETE a specific exchange rate
router.delete("/:baseCurrency/:targetCurrency", authMiddleware, (req, res) => {
  const { baseCurrency, targetCurrency } = req.params;

  const data = readData();

  if (!data[baseCurrency] || !data[baseCurrency][targetCurrency]) {
    return res.status(404).json({ message: "Rate not found." });
  }

  delete data[baseCurrency][targetCurrency];
  writeData(data);

  res.json({
    message: `Rate deleted for ${baseCurrency} to ${targetCurrency}.`,
    data,
  });
});

// POST convert currency
router.post("/convert", (req, res) => {
  const { baseCurrency, targetCurrency, amount } = req.body;

  if (!baseCurrency || !targetCurrency || !amount) {
    return res.status(400).json({
      message: "baseCurrency, targetCurrency, and amount are required.",
    });
  }

  const data = readData();

  if (!data[baseCurrency] || !data[baseCurrency][targetCurrency]) {
    return res.status(404).json({ message: "Conversion rate not found." });
  }

  const rate = data[baseCurrency][targetCurrency];
  const convertedAmount = parseFloat((amount * rate).toFixed(2));

  res.json({
    baseCurrency,
    targetCurrency,
    amount,
    rate,
    convertedAmount,
  });
});

module.exports = router;
