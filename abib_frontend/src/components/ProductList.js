import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchProducts } from "../api/productsApi";
import { addCartItem } from "../utils/cart";
import { buildProductMediaGallery } from "../utils/productMedia";
import { toMediaUrl } from "../config/api";
import "./ProductList.css";

const formatMediaUrl = (file) => {
  if (!file) return null;
  if (file.startsWith("http")) return file;
  if (file.endsWith(".mp4")) return toMediaUrl(file, "videos");
  return toMediaUrl(file, "images");
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const CATEGORY_KEYWORDS = {
  "phones-accessories": ["phones", "phone", "accessories", "mobile"],
  "computer-office": ["computer", "office", "laptop", "desktop"],
  "consumer-electronics": ["consumer electronics", "electronics", "gadgets"],
  "mens-clothing": ["mens", "men clothing", "male fashion"],
  "womens-clothing": ["womens", "women clothing", "female fashion"],
  "bags-shoes": ["bags", "bag", "shoes", "footwear"],
  "beauty-health-hair": ["beauty", "health", "hair", "personal care"],
  "home-garden-furniture": ["home", "garden", "furniture", "decor"],
  "home-improvement": ["home improvement", "improvement", "tools"],
  "toys-kids-babies": ["toys", "kids", "babies", "baby"],
  "sports-outdoors": ["sports", "fitness", "outdoors"],
  "automobiles-motorcycles": ["automobiles", "motorcycles", "automotive", "cars"],
  "jewelry-watches": ["jewelry", "watches", "accessories"],
};

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Price on request";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

const rearrangeProducts = (products, user) => {
  if (!user) return products;

  return [...products].sort((a, b) => {
    const salesDiff = (b.sales || 0) - (a.sales || 0);
    if (salesDiff !== 0) return salesDiff;

    return (b.stock || 0) - (a.stock || 0);
  });
};

const matchesCategory = (product, category) => {
  if (!category) return true;

  const normalizedCategory = normalizeText(category);
  const categoryValues = [
    product?.category,
    product?.subcategory,
    ...(Array.isArray(product?.tags) ? product.tags : []),
  ]
    .map(normalizeText)
    .filter(Boolean);

  if (categoryValues.some((value) => value === normalizedCategory)) {
    return true;
  }

  const keywords = CATEGORY_KEYWORDS[category] || [normalizedCategory];
  return categoryValues.some((value) =>
    keywords.some(
      (keyword) => value.includes(normalizeText(keyword)) || normalizeText(keyword).includes(value)
    )
  );
};

function ProductList({ searchQuery, category }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        setUser(jwtDecode(token));
      } catch {
        setUser(null);
      }
    };

    syncAuth();
    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);

      const response = await fetchProducts({
        page,
        limit: 30,
        search: searchQuery,
        category,
      });

      if (ignore) return;

      setProducts(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setLoading(false);
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [page, searchQuery, category]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (!feedback) return;

    const timeoutId = setTimeout(() => setFeedback(""), 2200);
    return () => clearTimeout(timeoutId);
  }, [feedback]);

  const filteredProducts = useMemo(() => {
    const arrangedProducts = rearrangeProducts(products, user);
    return arrangedProducts.filter((product) => matchesCategory(product, category));
  }, [products, user, category]);

  const handleAddToCart = useCallback((product) => {
    addCartItem(product, 1);
    setFeedback(`${product.name} added to cart`);
  }, []);

  const handleBuyNow = useCallback(
    (product) => {
      addCartItem(product, 1);
      navigate("/cart");
    },
    [navigate]
  );

  if (loading) {
    return <div className="product-loading">Loading products...</div>;
  }

  return (
    <div className="product-experience">
      <section className="product-results">
        <div>
          <div className="product-results__summary">
            Showing {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
            {searchQuery ? ` for "${searchQuery}"` : ""}
            {category ? ` in ${category}` : ""}
          </div>
          <p className="product-results__note">
            Bright picks, gift ideas, and trending essentials curated for fast checkout.
          </p>
        </div>

        {feedback ? <div className="product-results__feedback">{feedback}</div> : null}
      </section>

      {filteredProducts.length === 0 ? (
        <div className="product-empty">
          <h2>No products found</h2>
          <p>Try a broader search, switch category, or clear the current filter.</p>
        </div>
      ) : (
        <>
          <section className="product-grid">
            {filteredProducts.map((product) => {
              const gallery = buildProductMediaGallery(product).map(formatMediaUrl);
              const primaryImage = gallery[0];
              const productId = product._id || product.id;
              const price = product.price ?? product.salePrice ?? product.amount;
              const comparePrice = product.originalPrice ?? product.compareAtPrice;
              const hasDiscount =
                Number.isFinite(Number(comparePrice)) && Number(comparePrice) > Number(price);

              return (
                <article
                  key={productId}
                  className="product-card"
                >
                  <div className="product-card__media">
                    <span className="product-card__tag">
                      {product.category || "Featured"}
                    </span>

                    {gallery.length > 1 ? (
                      <span className="product-card__gallery-count">
                        +{gallery.length - 1} more
                      </span>
                    ) : null}

                    {primaryImage ? (
                      <img src={primaryImage} alt={product.name} />
                    ) : (
                      <div className="product-card__placeholder">ABIB</div>
                    )}
                  </div>

                  <div className="product-card__body">
                    <p className="product-card__category">{product.category || "Featured"}</p>
                    <h3 className="product-card__title">{product.name}</h3>
                    <p className="product-card__desc">
                      {product.description || "A standout store pick selected for quality and everyday use."}
                    </p>

                    <div className="product-card__price-row">
                      <div className="product-card__price-block">
                        <span className="product-card__price">{formatPrice(price)}</span>
                        {hasDiscount ? (
                          <span className="product-card__compare-price">
                            {formatPrice(comparePrice)}
                          </span>
                        ) : null}
                      </div>
                      <span className="product-card__stock">
                        {Number(product.stock) > 0 ? `${product.stock} in stock` : "Check availability"}
                      </span>
                    </div>

                    <div className="product-card__meta">
                      <span>{product.brand || "ABIB Select"}</span>
                      <span>{product.condition || "Ready to ship"}</span>
                    </div>

                    <div className="product-card__actions">
                      <button
                        type="button"
                        className="product-button product-button--primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        className="product-button product-button--secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleBuyNow(product);
                        }}
                      >
                        Checkout Fast
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {totalPages > 1 ? (
            <div className="product-pagination">
              <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page <= 1}>
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default ProductList
