import { API_URL } from "../config/api";

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}
