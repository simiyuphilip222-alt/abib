import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import PayPalButton from "../components/PayPalButton";
import { toMediaUrl } from "../config/api";
import { buildProductMediaGallery } from "../utils/productMedia";

function ProductCard({ product, onBuy }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState([]);

  // Initialize variant selection
  useEffect(() => {
    if (product.variants?.length) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  // Build gallery (images + video) based on selected variant
  useEffect(() => {
    setMediaList(buildProductMediaGallery(product, selectedVariant));
    setCurrentIndex(0); // Reset gallery to first image
  }, [selectedVariant, product]);

  const isVideo = mediaList.length && product.video && currentIndex === mediaList.length - 1;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  const price = Number(selectedVariant?.price || product.price || 0);

  return (
    <>
      {/* Product Card */}
      <div
        onClick={() => setModalOpen(true)}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          transition: "0.3s",
          textAlign: "center",
        }}
      >
        {mediaList[0] ? (
          isVideo ? (
            <video
              src={mediaList[currentIndex]}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={toMediaUrl(mediaList[currentIndex], "images")}
              alt={product.name}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
            />
          )
        ) : (
          <div style={{ width: "100%", height: "220px", backgroundColor: "#eee" }}>No Image</div>
        )}

        <div style={{ padding: "10px" }}>
          <h4 style={{ margin: 0, color: "#2c1a6b" }}>{product.name}</h4>
          <p style={{ fontWeight: "bold", color: "#a67c00" }}>${price.toFixed(2)}</p>
          <p style={{ color: "#777", fontSize: "14px" }}>{product.shortDescription || ""}</p>
          {product.stock <= 0 && <p style={{ color: "red", fontWeight: "bold" }}>Out of Stock</p>}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            {...swipeHandlers}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "900px",
              width: "100%",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              style={{
                float: "right",
                fontSize: "26px",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
              {/* Media */}
              <div style={{ position: "relative" }}>
                {isVideo ? (
                  <video
                    src={mediaList[currentIndex]}
                    style={{ width: "100%", borderRadius: "10px" }}
                    controls
                  />
                ) : (
                  <img
                    src={toMediaUrl(mediaList[currentIndex], "images")}
                    alt={product.name}
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                )}

                {/* Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "5px",
                        transform: "translateY(-50%)",
                        fontSize: "24px",
                        background: "rgba(0,0,0,0.3)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                      }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={handleNext}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "5px",
                        transform: "translateY(-50%)",
                        fontSize: "24px",
                        background: "rgba(0,0,0,0.3)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                      }}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Details */}
              <div>
                <h2>{product.name}</h2>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>${price.toFixed(2)}</p>
                <p>{product.longDescription || product.shortDescription}</p>

                {/* Variant selector */}
                {product.variants?.length > 0 && (
                  <div style={{ margin: "10px 0" }}>
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          marginRight: "8px",
                          padding: "4px 8px",
                          backgroundColor: v === selectedVariant ? "#2c1a6b" : "#eee",
                          color: v === selectedVariant ? "#fff" : "#000",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {v.color || v.size || v.sku || `Variant ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: "10px" }}>
                  <input type="number" min="1" defaultValue={1} style={{ width: "60px", marginRight: "8px" }} />
                  <button disabled={product.stock <= 0} onClick={() => onBuy(product)}>
                    Buy Now
                  </button>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <PayPalButton cart={[product]} total={price.toFixed(2)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
