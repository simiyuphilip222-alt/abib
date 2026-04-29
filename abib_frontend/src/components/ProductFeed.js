import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchProducts } from "../api/productsApi";
import { API_URL, toMediaUrl } from "../config/api";
import { addCartItem } from "../utils/cart";
import "./ProductFeed.css";

function ProductFeed({ searchQuery, category }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const storageKey = "abibSessionId";
    let nextSessionId = sessionStorage.getItem(storageKey);

    if (!nextSessionId) {
      nextSessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(storageKey, nextSessionId);
    }

    setSessionId(nextSessionId);
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetchProducts({
        search: searchQuery,
        category,
        limit: 20,
      });

      setProducts(res.data || []);
    };

    load();
  }, [searchQuery, category]);

  const track = (product, type) => {
    if (!sessionId) return;

    fetch(`${API_URL}/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        userId: user?.id || user?._id || null,
        productId: product?._id || product?.id || null,
        category: product?.category || null,
        type,
      }),
    }).catch(() => {});
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setImageIndex(0);
    track(product, "click");
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const nextImage = () => {
    if (!selectedProduct?.images?.length) return;
    setImageIndex((current) => (current + 1) % selectedProduct.images.length);
  };

  const prevImage = () => {
    if (!selectedProduct?.images?.length) return;
    setImageIndex((current) =>
      current === 0 ? selectedProduct.images.length - 1 : current - 1
    );
  };

  return (
    <>
      <div className="feed">
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="feed-item"
            onClick={() => openProduct(product)}
          >
            <img
              src={toMediaUrl(product.images?.[0], "images")}
              alt={product.name}
              className="feed-image"
            />

            <div className="feed-overlay">
              <h2>{product.name}</h2>
              <p>${product.price}</p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  addCartItem(product, 1);
                  track(product, "add_to_cart");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct ? (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-image-section">
              <img
                src={toMediaUrl(selectedProduct.images?.[imageIndex], "images")}
                alt={selectedProduct.name}
              />

              {selectedProduct.images?.length > 1 ? (
                <div className="image-controls">
                  <button type="button" onClick={prevImage}>
                    {"<"}
                  </button>
                  <button type="button" onClick={nextImage}>
                    {">"}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="modal-details">
              <h2>{selectedProduct.name}</h2>
              <p>${selectedProduct.price}</p>
              <p>{selectedProduct.description}</p>

              <button
                type="button"
                onClick={() => {
                  addCartItem(selectedProduct, 1);
                  track(selectedProduct, "add_to_cart");
                }}
              >
                Add to Cart
              </button>

              <button type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProductFeed;
