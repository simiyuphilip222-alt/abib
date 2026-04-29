import { API_URL } from "../config/api";

const ORDER_BASE_URL = `${API_URL}/orders`;

// Create new order
export async function createOrder(userId, items, paypalCaptureId) {
  try {
    const total = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );

    const res = await fetch(ORDER_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: userId,
        items: items.map((item) => ({
          productId: item.id || item.productId,
          price: item.price,
          quantity: item.quantity || 1,
          name: item.name,
        })),
        total,
        paypalCaptureId,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to create order:", err);
    return null;
  }
}

// Get order status
export async function getOrderStatus(orderNumber) {
  try {
    const res = await fetch(`${ORDER_BASE_URL}/${orderNumber}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to get order status:", err);
    return null;
  }
}
