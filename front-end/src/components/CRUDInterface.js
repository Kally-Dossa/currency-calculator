import { useState, useEffect } from "react";
import axios from "axios";
import "../Css/CRUDInterface.css";

export default function CRUDInterface() {
  const [activeAction, setActiveAction] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [rate, setRate] = useState("");
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetch all currencies
  const fetchCurrencies = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:8001/api/v1/data/");
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Add a new currency
  const addCurrency = async () => {
    try {
      if (!baseCurrency || !targetCurrency || !rate) {
        alert("Please fill all fields.");
        return;
      }

      await axios.post("http://localhost:8001/api/v1/data/", {
        baseCurrency,
        rates: { [targetCurrency]: parseFloat(rate) },
      });

      alert(`Currency ${baseCurrency} added successfully.`);
      fetchCurrencies();
    } catch (error) {
      console.error("Error adding currency", error);
    }
  };

  // Update an existing rate
  const updateRate = async () => {
    try {
      if (!baseCurrency || !targetCurrency || !rate) {
        alert("Please fill all fields.");
        return;
      }

      await axios.put(
        `http://localhost:8001/api/v1/data/${baseCurrency}/${targetCurrency}`,
        { rate: parseFloat(rate) }
      );

      alert(`Rate updated for ${baseCurrency} to ${targetCurrency}.`);
      fetchCurrencies();
    } catch (error) {
      console.error("Error updating rate", error);
    }
  };

  // Delete a specific rate
  const deleteRate = async () => {
    try {
      if (!baseCurrency || !targetCurrency) {
        alert("Please fill all fields.");
        return;
      }

      await axios.delete(
        `http://localhost:8001/api/v1/data/${baseCurrency}/${targetCurrency}`
      );

      alert(`Rate deleted for ${baseCurrency} to ${targetCurrency}.`);
      fetchCurrencies();
    } catch (error) {
      console.error("Error deleting rate", error);
    }
  };

  const renderAction = () => {
    switch (activeAction) {
      case "create":
        return (
          <div>
            <input
              type="text"
              placeholder="Base Currency"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Target Currency"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Exchange Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={addCurrency}
              className="bg-blue-500 text-white p-2 rounded w-full mb-2"
            >
              Add
            </button>
          </div>
        );
      case "read":
        return (
          <div>
            <button
              onClick={fetchCurrencies}
              className="bg-blue-500 text-white p-2 rounded w-full mb-4"
            >
              Refresh List
            </button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(currencies, null, 2)}
              </pre>
            )}
          </div>
        );
      case "update":
        return (
          <div>
            <select
              value={baseCurrency}
              onChange={(e) => {
                setBaseCurrency(e.target.value);
                setTargetCurrency(""); // Reset target currency when base changes
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Base Currency</option>
              {Object.keys(currencies).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {baseCurrency && (
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="border p-2 w-full mb-2"
              >
                <option value="">Select Target Currency</option>
                {Object.keys(currencies[baseCurrency] || {}).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            )}
            <input
              type="number"
              placeholder="New Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={updateRate}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Update Rate
            </button>
          </div>
        );
      case "delete":
        return (
          <div>
            <input
              type="text"
              placeholder="Base Currency"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Target Currency"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={deleteRate}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Delete Rate
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Currency Manager</h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveAction("create")}
          className={`p-2 rounded ${
            activeAction === "create" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setActiveAction("read")}
          className={`p-2 rounded ${
            activeAction === "read" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Read
        </button>
        <button
          onClick={() => setActiveAction("update")}
          className={`p-2 rounded ${
            activeAction === "update" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Update
        </button>
        <button
          onClick={() => setActiveAction("delete")}
          className={`p-2 rounded ${
            activeAction === "delete" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Delete
        </button>
      </div>
      {renderAction()}
    </div>
  );
}
