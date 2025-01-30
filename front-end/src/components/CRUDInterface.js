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

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/api/v1/data/");
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const addCurrency = async () => {
    try {
      const { baseCurrency, targetCurrency, rate } = createData;
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

  const updateRate = async () => {
    try {
      const { baseCurrency, targetCurrency, rate } = updateData;
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

  const deleteRate = async () => {
    try {
      const { baseCurrency, targetCurrency } = deleteData;
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
        <div>
          <button onClick={fetchCurrencies} className="btn btn-primary">
            Refresh List
          </button>
          <div className="info-box">
            !Note. Displaying exchange rates between available currencies.
          </div>
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
                          <span>{target}:</span> <span>{rate.toFixed(4)}</span>
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
          <select
            value={updateData.baseCurrency}
            onChange={(e) =>
              setUpdateData({ ...updateData, baseCurrency: e.target.value })
            }
            className="input-field"
          >
            <option value="">Select Base Currency</option>
            {Object.keys(currencies).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {updateData.baseCurrency && (
            <select
              value={updateData.targetCurrency}
              onChange={(e) =>
                setUpdateData({ ...updateData, targetCurrency: e.target.value })
              }
              className="input-field"
            >
              <option value="">Select Target Currency</option>
              {Object.keys(currencies[updateData.baseCurrency] || {}).map(
                (currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                )
              )}
            </select>
          )}
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
          <select
            value={deleteData.baseCurrency}
            onChange={(e) =>
              setDeleteData({ ...deleteData, baseCurrency: e.target.value })
            }
            className="input-field"
          >
            <option value="">Select Base Currency</option>
            {Object.keys(currencies).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {deleteData.baseCurrency && (
            <select
              value={deleteData.targetCurrency}
              onChange={(e) =>
                setDeleteData({ ...deleteData, targetCurrency: e.target.value })
              }
              className="input-field"
            >
              <option value="">Select Target Currency</option>
              {Object.keys(currencies[deleteData.baseCurrency] || {}).map(
                (currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                )
              )}
            </select>
          )}
          <button onClick={deleteRate} className="btn btn-primary">
            Delete Rate
          </button>
        </div>
      )}
    </div>
  );
}
