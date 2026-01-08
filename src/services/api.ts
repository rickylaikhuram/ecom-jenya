import api from "../lib/instance";
import type { LoginCredentials } from "../types";

// auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// products API
export const productsAPI = {
  getAllProducts: async (skip = 0, limit = 20) => {
    const response = await api.get(`/products?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getProductsByCategory: async (category: string, skip = 0, limit = 20) => {
    const response = await api.get(
      `/products/category/${category}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/products/categories");
    return response.data;
  },
};
