import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css"; // Αν χρησιμοποιείς Bootstrap

// Δημιουργία root για το React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
