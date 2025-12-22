import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://Al-hafiid.somsoftsystems.com/api",
    headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
  },
});

// token automatic u raaci request kasta
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
