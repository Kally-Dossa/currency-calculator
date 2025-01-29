import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
        {!isLoggedIn ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Routes>
            {/* Προεπιλεγμένη διαδρομή μετά το login */}
            <Route
              path="/"
              element={
                <div>
                  <h1 className="text-center mt-4 main-title">
                    Welcome, {username}
                  </h1>
                  <CurrencyConverter />
                </div>
              }
            />
            {/* Διαδρομή για την επιλογή "Business" */}
            <Route path="/business" element={<CRUDInterface />} />
            {/* Αν δεν υπάρχει αντιστοιχία, επιστροφή στο "/" */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
