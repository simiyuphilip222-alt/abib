import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);

  async function loadMethods() {
    const { data } = await supabase.from("payment_methods").select("*");
    setMethods(data || []);
  }

  async function toggleMethod(id, enabled) {
    await supabase.from("payment_methods").update({ enabled: !enabled }).eq("id", id);
    loadMethods();
  }

  useEffect(() => { loadMethods(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Methods</h1>
      {methods.map((m) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center",
          padding: "10px", borderBottom: "1px solid #eee" }}>
          <img src={m.icon_url} width={40} style={{ marginRight: 10 }} />
          <strong style={{ flexGrow: 1 }}>{m.name}</strong>
          <button onClick={() => toggleMethod(m.id, m.enabled)}
            style={{ padding: "6px 10px", borderRadius: 6,
            background: m.enabled ? "green" : "gray", color: "white", border: "none" }}>
            {m.enabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      ))}
    </div>
  );
}
