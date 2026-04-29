import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegUser, FaShoppingBag } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import SearchBar from "./SearchBar";
import "./Header.css";
import { CART_EVENT, getCartCount } from "../utils/cart";
import { logout } from "../utils/auth";

function Header({
  onSearchResults,
  activeCategory,
  onCategoryChange,
  showCategoryBar,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());

    syncCart();
    window.addEventListener(CART_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

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

  const handleSearch = (value) => {
    setSearchInput(value);
    onSearchResults?.(value);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand" onClick={() => navigate("/")}>
          <span className="site-header__logo">ABIB</span>
        </div>

        <div className="site-header__search">
          <SearchBar value={searchInput} onChange={handleSearch} />
        </div>

        <div className="site-header__actions">
          <button type="button" className="site-header__icon" aria-label="Wishlist">
            <FaHeart />
            <span>Favourite</span>
          </button>

          <button
            type="button"
            className="site-header__icon"
            aria-label="Cart"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingBag />
            <span>Cart</span>
            {cartCount > 0 ? (
              <span className="site-header__badge">{cartCount}</span>
            ) : null}
          </button>

          <button
            type="button"
            className="site-header__icon"
            aria-label="Account"
            onClick={() => navigate(user ? "/account" : "/login")}
          >
            <FaRegUser />
            <span>{user ? "My Account" : "Login"}</span>
          </button>

          <button
            type="button"
            className="site-header__auth"
            onClick={() => (user ? logout() : navigate("/login"))}
          >
            {user ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>

      {showCategoryBar ? (
        <div className="site-header__category-bar">
          <button
            type="button"
            className={`site-header__category-link ${
              !activeCategory ? "is-active" : ""
            }`}
            onClick={() => onCategoryChange?.("")}
          >
            All Products
          </button>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
