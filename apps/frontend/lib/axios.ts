import axios from "axios";


// change base URL to process.env.NEXT_PUBLIC_API_URLL while production
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
