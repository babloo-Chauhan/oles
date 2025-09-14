import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:8080/api" });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  const user = localStorage.getItem("username");
  if (user) cfg.headers["X-User"] = user; // used by submit/result endpoints
  return cfg;
});
export default api;
