import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const client = axios.create({
  baseURL: API + "/api",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem("hf_token");
  if(token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;
