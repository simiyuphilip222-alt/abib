import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import Zaria from "./components/Zaria";
import CategorySidebar from "./components/CategorySidebar";

import MyAccount from "./pages/MyAccount";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { API_URL } from "./config/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AppContent({ userId, setUserId, googleClientId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const showCatalogFilters = location.pathname === "/";

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/tags/categories`);
        const data = await response.json();

        if (!ignore) {
          setCategories(data.data?.categories || []);
        }
      } catch (_error) {
        if (!ignore) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!showCatalogFilters) {
      setSearchQuery("");
      setSelectedCategory("");
    }
  }, [showCatalogFilters]);

  return (
    <GoogleOAuthProvider clientId={googleClientId || "missing-google-client-id"}>
      <div className="app-shell">
        <Header
          onSearchResults={setSearchQuery}
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showCategoryBar={showCatalogFilters}
        />

        <div className={`app-layout ${showCatalogFilters ? "" : "app-layout--single"}`}>
          {showCatalogFilters ? (
            <CategorySidebar
              categories={categories}
              activeCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          ) : null}

          <main className="app-main">
            <Routes>
              <Route
                path="/"
                element={
                  <ProductList
                    userId={userId}
                    searchQuery={searchQuery}
                    category={selectedCategory}
                  />
                }
              />
              <Route
                path="/account"
                element={<MyAccount userId={userId} setUserId={setUserId} />}
              />
              <Route path="/cart" element={<Cart userId={userId} />} />
              <Route path="/register" element={<Register setUserId={setUserId} />} />
              <Route path="/login" element={<Login setUserId={setUserId} />} />
              <Route path="/verify/:token" element={<Verify />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset/:token" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
        </div>

        <Footer />
        <Zaria onQuery={setSearchQuery} />
      </div>
    </GoogleOAuthProvider>
  );
}

function App() {
  const [userId, setUserId] = useState(null);
  const googleClientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    process.env.REACT_APP_GOOGLE_CLIENTID ||
    "";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <Router>
      <AppContent
        userId={userId}
        setUserId={setUserId}
        googleClientId={googleClientId}
      />
    </Router>
  );
}

export default App;
