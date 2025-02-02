import { useState, useEffect } from "react";
import axios from "axios";
import "../Css/CRUDInterface.css";

export default function CRUDInterface() {
  const [activeAction, setActiveAction] = useState(null);
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(false);

  const [createData, setCreateData] = useState({
    baseCurrency: "",
    targetCurrency: "",
    rate: "",
  });
  const [updateData, setUpdateData] = useState({
    baseCurrency: "",
    targetCurrency: "",
    rate: "",
  });
  const [deleteData, setDeleteData] = useState({
    baseCurrency: "",
    targetCurrency: "",
  });

  const getAuthToken = () => `Basic ${localStorage.getItem("authToken")}`;
  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      console.log("Token Sent:", token);

      const response = await axios.get("http://localhost:8001/api/v1/data/", {
        headers: { Authorization: token },
      });
      console.log("Response Data:", response.data);

      setCurrencies(response.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or error
    }
  };

  const addCurrency = async () => {
    const { baseCurrency, targetCurrency, rate } = createData; // Extract values from state

    if (!baseCurrency || !targetCurrency || !rate) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const token = getAuthToken();
      await axios.post(
        "http://localhost:8001/api/v1/data/",
        {
          baseCurrency: baseCurrency.trim(),
          rates: { [targetCurrency.trim()]: parseFloat(rate) }, // Ensure proper payload structure
        },
        {
          headers: { Authorization: token },
        }
      );
      fetchCurrencies();
      // clear input fields
      setCreateData({ baseCurrency: "", targetCurrency: "", rate: "" });
      alert("Currency added successfully!");
    } catch (error) {
      console.error(
        "Error adding currency:",
        error.response?.data || error.message
      );
      alert("Failed to add currency. Please check your input and try again.");
    }
  };

  const updateRate = async () => {
    try {
      const token = getAuthToken();
      if (
        !updateData.baseCurrency ||
        !updateData.targetCurrency ||
        !updateData.rate
      ) {
        alert("Please fill all fields.");
        return;
      }

      await axios.put(
        `http://localhost:8001/api/v1/data/${updateData.baseCurrency}/${updateData.targetCurrency}`,
        { rate: parseFloat(updateData.rate) },
        { headers: { Authorization: token } }
      );
      fetchCurrencies();
      // clear input fields
      setUpdateData({ baseCurrency: "", targetCurrency: "", rate: "" });
    } catch (error) {
      console.error("Error updating rate", error);
    }
  };

  const deleteRate = async () => {
    try {
      const token = getAuthToken();
      if (!deleteData.baseCurrency || !deleteData.targetCurrency) {
        alert("Please fill all fields.");
        return;
      }

      await axios.delete(
        `http://localhost:8001/api/v1/data/${deleteData.baseCurrency}/${deleteData.targetCurrency}`,
        { headers: { Authorization: token } }
      );
      fetchCurrencies();
      // clear input fields
      setDeleteData({ baseCurrency: "", targetCurrency: "" });
    } catch (error) {
      console.error("Error deleting rate", error);
    }
  };

  return (
    <div className="crud-container">
      <h2 className="header-title">Currency Manager</h2>
      <div className="action-buttons">
        {["create", "read", "update", "delete"].map((action) => (
          <button
            key={action}
            onClick={() => setActiveAction(action)}
            className={`btn-manager ${
              activeAction === action ? "btn-manager-active" : ""
            }`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
      </div>
      {activeAction === "create" && (
        <div className="action-form">
          <input
            type="text"
            placeholder="Base Currency"
            value={createData.baseCurrency}
            onChange={(e) =>
              setCreateData({ ...createData, baseCurrency: e.target.value })
            }
            className="input-field"
          />
          <input
            type="text"
            placeholder="Target Currency"
            value={createData.targetCurrency}
            onChange={(e) =>
              setCreateData({ ...createData, targetCurrency: e.target.value })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="Exchange Rate"
            value={createData.rate}
            onChange={(e) =>
              setCreateData({ ...createData, rate: e.target.value })
            }
            className="input-field"
          />
          <button onClick={addCurrency} className="btn btn-primary">
            Add Currency
          </button>
        </div>
      )}
      {activeAction === "read" && (
        <div className="read-action">
          <button
            onClick={fetchCurrencies}
            className="btn btn-primary refresh-btn"
          >
            Refresh List
          </button>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div className="data-container">
              {Object.keys(currencies).length === 0 ? (
                <p>No currency exchange data available.</p>
              ) : (
                Object.keys(currencies).map((currency) => (
                  <div key={currency} className="data-card">
                    <div className="data-card-header">{currency}</div>
                    {Object.entries(currencies[currency] || {}).map(
                      ([target, rate]) => (
                        <div key={target} className="data-item">
                          <span>{target}:</span>
                          <span>
                            {typeof rate === "number" && !isNaN(rate)
                              ? rate.toFixed(4)
                              : "Invalid Rate"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
      {activeAction === "update" && (
        <div className="action-form">
          <input
            type="text"
            placeholder="Base Currency"
            value={updateData.baseCurrency}
            onChange={(e) =>
              setUpdateData({ ...updateData, baseCurrency: e.target.value })
            }
            className="input-field"
          />
          <input
            type="text"
            placeholder="Target Currency"
            value={updateData.targetCurrency}
            onChange={(e) =>
              setUpdateData({ ...updateData, targetCurrency: e.target.value })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="New Rate"
            value={updateData.rate}
            onChange={(e) =>
              setUpdateData({ ...updateData, rate: e.target.value })
            }
            className="input-field"
          />
          <button onClick={updateRate} className="btn btn-primary">
            Update Rate
          </button>
        </div>
      )}

      {activeAction === "delete" && (
        <div className="action-form">
          <input
            type="text"
            placeholder="Base Currency"
            value={deleteData.baseCurrency}
            onChange={(e) =>
              setDeleteData({ ...deleteData, baseCurrency: e.target.value })
            }
            className="input-field"
          />
          <input
            type="text"
            placeholder="Target Currency"
            value={deleteData.targetCurrency}
            onChange={(e) =>
              setDeleteData({ ...deleteData, targetCurrency: e.target.value })
            }
            className="input-field"
          />
          <button onClick={deleteRate} className="btn btn-primary">
            Delete Rate
          </button>
        </div>
      )}
    </div>
  );
}
