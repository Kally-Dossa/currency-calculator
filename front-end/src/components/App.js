import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./LoginForm";
import CurrencyConverter from "./CurrencyConverter";
import CRUDInterface from "./CRUDInterface";

import "./../Css/App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Αρχική διαδρομή: CurrencyConverter */}
          <Route path="/" element={<CurrencyConverter />} />
          {/* Διαδρομή για Login */}
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          {/* Διαδρομή για CRUDInterface */}
          <Route
            path="/admin"
            element={isLoggedIn ? <CRUDInterface /> : <Navigate to="/login" />}
          />
          {/* Αν δεν υπάρχει αντιστοιχία, επιστροφή στο "/" */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
