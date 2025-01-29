import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Προσθήκη του useNavigate
import axios from "axios";
import "../Css/CurrencyConverter.css";
import { BsArrowLeftRight } from "react-icons/bs";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [mode, setMode] = useState("Personal"); // Νέα κατάσταση για το mode

  const navigate = useNavigate(); // Για πλοήγηση στις σελίδες

  // Fetch available currencies from the backend
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/v1/data/");
        setCurrencies(Object.keys(response.data));
        setBaseCurrency(Object.keys(response.data)[0]); // Default base currency
        setTargetCurrency(Object.keys(response.data)[1]); // Default target currency
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8001/api/v1/data/convert",
        {
          baseCurrency,
          targetCurrency,
          amount: parseFloat(amount),
        }
      );
      setConvertedAmount(response.data.convertedAmount);
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  // Function to swap base and target currencies
  const swapCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  // Λειτουργία για αλλαγή mode και πλοήγηση
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "Business") {
      navigate("/business"); // Πλοήγηση στη σελίδα Business
    } else {
      navigate("/personal"); // Πλοήγηση στη σελίδα Personal (προαιρετικά)
    }
  };

  return (
    <div className="calculator">
      <div className="container mt-4 custom-class">
        {/* Personal | Business Toggle */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <span
            className={`toggle-option ${mode === "Personal" ? "active" : ""}`}
            onClick={() => handleModeChange("Personal")}
          >
            Personal
          </span>
          <span className="mx-2">|</span>
          <span
            className={`toggle-option ${mode === "Business" ? "active" : ""}`}
            onClick={() => handleModeChange("Business")}
          >
            Business
          </span>
        </div>

        <h2 className="text-center-sm">
          Check live foreign currency exchange rates
        </h2>

        <div className="custom-box">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">From</label>
              <select
                className="form-select"
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} {currencySymbols[currency] || ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Icon */}
            <div className="col-md-1 text-center mt-4">
              <button
                className="btn swap-btn"
                onClick={swapCurrencies}
                aria-label="Swap currencies"
              >
                <BsArrowLeftRight size={24} color="#495057" />
              </button>
            </div>

            <div className="col-md-3">
              <label className="form-label">To</label>
              <select
                className="form-select"
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} {currencySymbols[currency] || ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn  w-100 mt-4 convert-btn"
                onClick={handleConvert}
              >
                Convert
              </button>
            </div>
          </div>
        </div>

        {convertedAmount !== null && (
          <div className="text-center mt-4">
            <h4>
              Converted Amount: {currencySymbols[targetCurrency] || ""}{" "}
              {convertedAmount} {targetCurrency}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
