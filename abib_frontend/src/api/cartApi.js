import { API_URL } from "../config/api";

const BASE_URL = `${API_URL}/cart`;

export const addToCart = async (payload) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const getCart = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`);
  return res.json();
};

export const removeFromCart = async (payload) => {
  const res = await fetch(`${BASE_URL}/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const updateQuantity = async (payload) => {
  const res = await fetch(`${BASE_URL}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const clearCart = async (userId) => {
  const res = await fetch(`${BASE_URL}/clear/${userId}`, {
    method: "DELETE",
  });

  return res.json();
};
