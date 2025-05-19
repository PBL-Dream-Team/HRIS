import axios from "axios";


// change base URL to process.env.NEXT_PUBLIC_API_URL while production
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
