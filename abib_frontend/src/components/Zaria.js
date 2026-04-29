import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import "./Zaria.css";

function Zaria({ onQuery }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Ask for a product type, collection, or gift idea and I’ll narrow the catalog for you.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const nextInput = input.trim();
    if (!nextInput) return;

    if (onQuery) {
      onQuery(nextInput);
    }

    setMessages((current) => [
      ...current,
      { type: "user", text: nextInput },
      {
        type: "ai",
        text: `I filtered the storefront for "${nextInput}". You can keep refining your search or open the cart when you're ready.`,
      },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        className="zaria-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open Zaria assistant"
      >
        <FaComments />
      </button>

      {open && (
        <div className="zaria-panel">
          <div className="zaria-panel__header">
            <strong>Zaria Assistant</strong>
            <span>Quick product filtering and shopping guidance</span>
          </div>

          <div className="zaria-panel__messages">
            {messages.map((message, index) => (
              <div
                key={`${message.type}-${index}`}
                className={`zaria-panel__bubble zaria-panel__bubble--${message.type}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="zaria-panel__composer">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Zaria to find something..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button type="button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Zaria;
