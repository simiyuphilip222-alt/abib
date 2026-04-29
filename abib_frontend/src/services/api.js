import { API_URL } from "../config/api";

/**
 * =========================
 * CORE API HANDLER
 * =========================
 */
const request = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${url}]:`, error.message);
    throw error;
  }
};

/**
 * =========================
 * PRODUCTS
 * =========================
 */
export const getProducts = async () => {
  try {
    return await request("/products");
  } catch {
    return [];
  }
};

export const getProductById = async (id) => {
  return request(`/products/${id}`);
};

export const updateProduct = async (id, payload) => {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

/**
 * =========================
 * ORDERS
 * =========================
 */
export const getOrders = async () => {
  try {
    return await request("/orders");
  } catch {
    return [];
  }
};

export const updateOrderStatus = async (id, status) => {
  return request(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

/**
 * =========================
 * ADMIN ANALYTICS
 * =========================
 */
export const getAdminStats = async () => {
  try {
    return await request("/admin");
  } catch {
    return {
      revenue: 0,
      orders: 0,
      inventory: 0,
      customers: 0,
    };
  }
};