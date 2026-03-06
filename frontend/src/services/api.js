// frontend/src/services/api.js
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://esam-erp.onrender.com/api" // Your live backend
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Rest of your code...
