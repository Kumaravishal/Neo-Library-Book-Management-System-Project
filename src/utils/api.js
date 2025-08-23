import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔄 Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.error("❌ API Response Error:", status, data);

    // Normalize error object
    return Promise.reject({
      status: status || 500,
      message: data?.message || "Unexpected server error",
      data,
    });
  }
);

// 🔐 LOGIN
export const loginUser = async ({ email, password, role }) => {
  try {
    console.log("🔐 Login attempt:", { email, role });

    const response = await api.post("/users/login", { email, password, role });
    const { success, user, message } = response.data;

    if (success && user) {
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("isAuthenticated", "true");
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login API Error:", error);
    throw error; // will always have { status, message, data }
  }
};

// 📝 REGISTER
export const registerUser = async (userData) => {
  try {
    console.log("📝 Register attempt:", userData);

    const response = await api.post("/users/register", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Register API Error:", error);
    throw error;
  }
};

// 🌐 TEST CONNECTION
export const testConnection = async () => {
  try {
    const response = await api.get("/users/test");
    return response.data;
  } catch (error) {
    console.error("❌ Backend Connection Error:", error);
    throw new Error("Backend server is not reachable");
  }
};
