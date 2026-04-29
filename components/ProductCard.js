export default function ProductCard({ product }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: "12px", padding: "16px",
      width: "100%", maxWidth: "280px", background: "white" }}>
      <img src={product.image} alt={product.name}
        style={{ width: "100%", height: "200px", objectFit: "cover",
        borderRadius: "10px" }} />
      <h3 style={{ marginTop: "12px", fontSize: "18px", fontWeight: "600" }}>{product.name}</h3>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>{product.description}</p>
      <p style={{ fontSize: "16px", fontWeight: "700" }}>Price: KES {product.price}</p>
      <p style={{ fontSize: "14px", color: product.stock > 0 ? "green" : "red" }}>
        Stock: {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
      </p>
      <p style={{ margin: "6px 0" }}>
        Rating: {"★".repeat(Math.floor(product.rating))}{" "}
        {"☆".repeat(5 - Math.floor(product.rating))} ({product.rating})
      </p>
      <div style={{ margin: "10px 0", display: "flex", gap: "8px" }}>
        <img src="/payments/visa.png" width={40} />
        <img src="/payments/mpesa.png" width={40} />
        <img src="/payments/paypal.png" width={40} />
      </div>
      <button style={{ marginTop: "10px", width: "100%", padding: "10px",
        background: "black", color: "white", borderRadius: "8px", border: "none" }}>
        Add to Cart
      </button>
    </div>
  );
}
