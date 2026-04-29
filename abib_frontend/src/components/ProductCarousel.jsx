import { useState, useMemo } from "react";

const ProductCarousel = ({ images = [], max = null }) => {
  // Ensure safe array + prevent unnecessary recalculations
  const displayImages = useMemo(() => {
    const safeImages = Array.isArray(images) ? images : [];
    return max ? safeImages.slice(0, max) : safeImages;
  }, [images, max]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset index if images change
  if (activeIndex >= displayImages.length) {
    setActiveIndex(0);
  }

  if (displayImages.length === 0) {
    return (
      <div className="carousel-empty">
        No images available
      </div>
    );
  }

  const activeImage = displayImages[activeIndex];

  return (
    <div className="abib-carousel">

      {/* MAIN IMAGE (optimized loading) */}
      <div className="main-image">
        <img
          src={activeImage}
          alt={`product-${activeIndex}`}
          loading="lazy"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="thumbnail-grid">
        {displayImages.map((img, index) => (
          <button
            key={index}
            type="button"
            className={`thumb-image ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={img}
              alt={`thumb-${index}`}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

    </div>
  );
};

export default ProductCarousel;