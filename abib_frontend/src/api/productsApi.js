import { API_URL } from "../config/api";

export async function fetchProducts({
  page = 1,
  limit = 30,
  search = "",
  q = "",
  category = "",
} = {}) {
  try {
    const params = new URLSearchParams();
    const searchValue = String(search || q || "").trim();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (category && category.trim() !== "") {
      params.set("category", category.trim());
    }

    const res = await fetch(`${API_URL}/products?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();

    return {
      data: data.data || [],
      pagination: data.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error.message);

    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 1,
      },
    };
  }
}
