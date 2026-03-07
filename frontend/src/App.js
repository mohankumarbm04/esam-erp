// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Router>
      <Login />
    </Router>
  );
}

export default App;
