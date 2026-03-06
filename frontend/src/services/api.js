const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://esam-erp.onrender.com/api" // Change this!
    : "http://localhost:5000/api";
