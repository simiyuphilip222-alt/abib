import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CJProducts({ profitPercentage = 30 }) { // default 30% profit
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCJProducts = async () => {
      try {
        const res = await axios.get("/api/cj/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch CJ products:", err);
      }
    };
    fetchCJProducts();
  }, []);

  const addToCart = (product) => {
    const sellingPrice = +(product.price * (1 + profitPercentage / 100)).toFixed(2);
    const cartItem = { ...product, sellingPrice, quantity: 1 };
    setCart((prev) => [...prev, cartItem]);
    alert(`${product.name} added to cart at $${sellingPrice}`);
  };

  // Helper to get the main image with fallback
  const getProductImage = (product) => {
    return (
      product.images?.[0] || // main images array
      product.variantImages?.[0]?.images?.[0] || // first variant image
      "https://via.placeholder.com/200x200?text=No+Image" // fallback
    );
  };

  return (
    <div>
      <h2>CJ Products</h2>
      <div className="product-grid" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {products.map((p) => {
          const sellingPrice = +(p.price * (1 + profitPercentage / 100)).toFixed(2);
          return (
            <div
              key={p._id || p.id}
              className="product-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                width: "200px",
                textAlign: "center",
              }}
            >
              <img
                src={getProductImage(p)}
                alt={p.name}
                style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "0.5rem" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/200x200?text=No+Image"; }}
              />
              <h3 style={{ fontSize: "1rem", margin: "0.5rem 0" }}>{p.name}</h3>
              <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>${sellingPrice}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div className="cart" style={{ marginTop: "2rem" }}>
          <h3>Cart ({cart.length} items)</h3>
          {cart.map((item, index) => (
            <div key={index}>
              {item.name} - ${item.sellingPrice} x {item.quantity}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}