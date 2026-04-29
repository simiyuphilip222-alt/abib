import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "../components/PayPalButton";
import "./Cart.css";
import { clearCartStorage, readCart, writeCart } from "../utils/cart";

function Cart({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(readCart());
  }, []);

  const saveCart = (items) => {
    setCartItems(writeCart(items));
  };

  const removeItem = (id) => {
    saveCart(cartItems.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    saveCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    saveCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
        0
      ),
    [cartItems]
  );

  const shipping = cartItems.length > 0 ? 12 : 0;
  const total = (subtotal + shipping).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h1>Your cart is empty</h1>
          <p>
            Add a few products from the catalog and come back when you&apos;re
            ready to review your order.
          </p>
          <div className="cart-actions">
            <button
              type="button"
              className="cart-action cart-action--primary"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="cart-page__hero">
        <div className="cart-card">
          <h1>Review your cart before checkout.</h1>
          <p>
            Adjust quantities, remove products, and confirm your order summary
            before sending the payment request.
          </p>
        </div>
        <div className="cart-card cart-hero__panel">
          <span>Cart status</span>
          <strong>{cartItems.length} items</strong>
          <p>Local cart sync is active and checkout is ready for testing.</p>
        </div>
      </section>

      <section className="cart-layout">
        <div className="cart-card">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img
                  src={item.image || "https://placehold.co/220x220?text=ABIB"}
                  alt={item.name}
                  className="cart-item__image"
                />

                <div>
                  <h2 className="cart-item__title">{item.name}</h2>
                  <div className="cart-item__meta">
                    Quantity can be adjusted directly from your cart.
                  </div>
                  <div className="cart-item__price">
                    ${(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                  </div>
                </div>

                <div>
                  <div className="cart-qty">
                    <button type="button" onClick={() => decreaseQty(item.id)}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => increaseQty(item.id)}>
                      +
                    </button>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <p>These totals are calculated from the current local cart.</p>

          <div className="cart-summary__rows">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row cart-summary__total">
              <strong>Total</strong>
              <strong>${total}</strong>
            </div>
          </div>

          <PayPalButton
            cart={cartItems}
            onSuccess={() => {
              clearCartStorage();
              setCartItems([]);
            }}
          />

          {!localStorage.getItem("token") && (
            <p className="cart-auth-note">
              Sign in before payment so your order history and recovery flow stay attached to your account.
            </p>
          )}

          <div className="cart-actions">
            {!localStorage.getItem("token") && (
              <button
                type="button"
                className="cart-action cart-action--primary"
                onClick={() => navigate("/login")}
              >
                Sign In for Checkout
              </button>
            )}
            <button
              type="button"
              className="cart-action cart-action--ghost"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Cart;
