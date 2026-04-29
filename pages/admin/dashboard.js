import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, todayRevenue: 0, methodTotals: [],
  });

  async function loadStats() {
    const { data: orders } = await supabase.from("orders").select("*");
    const o = orders || [];

    const totalRevenue = o.reduce((s, x) => s + Number(x.total_amount), 0);
    const totalOrders = o.length;

    const today = new Date().toISOString().split("T")[0];
    const todayRevenue = o.filter((x) => x.created_at?.startsWith(today))
      .reduce((s, x) => s + Number(x.total_amount), 0);

    const methodTotals = {};
    o.forEach((x) => methodTotals[x.payment_method] =
      (methodTotals[x.payment_method] || 0) + Number(x.total_amount));

    setStats({
      totalRevenue,
      totalOrders,
      todayRevenue,
      methodTotals: Object.entries(methodTotals).map(([m, t]) => ({ method: m, total: t }))
    });
  }

  useEffect(() => { loadStats(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Store Finances</h1>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={card}><h3>Total Revenue</h3><p>KES {stats.totalRevenue}</p></div>
        <div style={card}><h3>Total Orders</h3><p>{stats.totalOrders}</p></div>
        <div style={card}><h3>Today’s Revenue</h3><p>KES {stats.todayRevenue}</p></div>
      </div>

      <h2 style={{ marginTop: 30 }}>Revenue by Payment Method</h2>
      {stats.methodTotals.map((m) => (
        <p key={m.method}>{m.method}: KES {m.total}</p>
      ))}
    </div>
  );
}

const card = {
  padding: 20, border: "1px solid #eee", borderRadius: 10,
  background: "white", minWidth: 200
};
