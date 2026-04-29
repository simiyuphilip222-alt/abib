import "./productImages.css";

const ProductImages = ({ images = [], max = null }) => {
  // Safety: ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  // Optional limit (if provided)
  const displayImages = max ? safeImages.slice(0, max) : safeImages;

  if (displayImages.length === 0) {
    return (
      <div className="image-grid empty">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="image-grid">
      {displayImages.map((img, index) => (
        <div key={index} className="image-box">
          <img
            src={img}
            alt={`product-${index}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default ProductImages;