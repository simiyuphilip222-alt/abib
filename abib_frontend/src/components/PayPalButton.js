import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { API_URL } from "../config/api";

function PayPalButton({ cart = [], onSuccess }) {
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/paypal/config`);

        if (isMounted) {
          setPaypalConfig(data);
        }
      } catch (_error) {
        if (isMounted) {
          setError("PayPal is not available right now.");
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(
    () =>
      cart.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.qty || item.quantity || 1),
      })),
    [cart]
  );

  if (!token) {
    return (
      <div className="paypal-state">
        <strong>Sign in to complete payment.</strong>
        <p>Your order will be attached to your account for tracking and recovery.</p>
      </div>
    );
  }

  if (error) {
    return <div className="paypal-state paypal-state--error">{error}</div>;
  }

  if (!paypalConfig?.clientId) {
    return <div className="paypal-state">Loading secure checkout...</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalConfig.clientId,
        currency: paypalConfig.currency || "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect", label: "paypal" }}
        disabled={!items.length}
        forceReRender={[items.length]}
        createOrder={async () => {
          const { data } = await axios.post(`${API_URL}/paypal/create-order`, {
            items,
          });

          return data.id;
        }}
        onApprove={async ({ orderID }) => {
          const { data } = await axios.post(
            `${API_URL}/paypal/capture-order`,
            { orderID, items },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (onSuccess) {
            onSuccess(data);
          }
        }}
        onError={() => {
          setError("PayPal checkout failed. Please try again.");
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;
