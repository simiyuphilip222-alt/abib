import React, { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import "./AdminDashboard.css";

const emptyOverview = {
  revenue: 0,
  totalOrders: 0,
  paidOrders: 0,
  totalProducts: 0,
  lowStockProducts: 0,
  totalCustomers: 0,
  recentOrders: [],
};

function AdminDashboard() {
  const [overview, setOverview] = useState(emptyOverview);
  const [alerts, setAlerts] = useState([]);
  const [userStats, setUserStats] = useState({
    onlineNow: 0,
    last24h: 0,
    last7d: 0,
    last30d: 0,
    last6m: 0,
    last1y: 0,
    last5y: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin access requires a signed-in admin session.");
      return;
    }

    const authHeaders = {
      Authorization: `Bearer ${token}`,
    };

    const loadDashboard = async () => {
      try {
        const [overviewRes, alertsRes, onlineRes, dayRes, weekRes, monthRes, sixMonthRes, yearRes, fiveYearRes] =
          await Promise.all([
            fetch(`${API_URL}/admin/overview`, { headers: authHeaders }),
            fetch(`${API_URL}/admin/alerts`, { headers: authHeaders }),
            fetch(`${API_URL}/analytics/online`),
            fetch(`${API_URL}/analytics/24h`),
            fetch(`${API_URL}/analytics/7d`),
            fetch(`${API_URL}/analytics/30d`),
            fetch(`${API_URL}/analytics/6m`),
            fetch(`${API_URL}/analytics/1y`),
            fetch(`${API_URL}/analytics/5y`),
          ]);

        const overviewData = await overviewRes.json();
        const alertsData = await alertsRes.json();
        const onlineData = await onlineRes.json();
        const dayData = await dayRes.json();
        const weekData = await weekRes.json();
        const monthData = await monthRes.json();
        const sixMonthData = await sixMonthRes.json();
        const yearData = await yearRes.json();
        const fiveYearData = await fiveYearRes.json();

        if (!overviewRes.ok) {
          throw new Error(overviewData.message || "Unable to load admin overview");
        }

        setOverview(overviewData.data || emptyOverview);
        setAlerts(Array.isArray(alertsData) ? alertsData : []);
        setUserStats({
          onlineNow: onlineData.online || 0,
          last24h: dayData.users || 0,
          last7d: weekData.users || 0,
          last30d: monthData.users || 0,
          last6m: sixMonthData.users || 0,
          last1y: yearData.users || 0,
          last5y: fiveYearData.users || 0,
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load dashboard.");
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Live business metrics from the backend.</p>
        </div>
        <div className="admin-hero-panel">
          <strong>${Number(overview.revenue || 0).toFixed(2)}</strong>
          <p>Recorded revenue</p>
        </div>
      </section>

      {error ? <section className="admin-panel">{error}</section> : null}

      <section className="admin-stats-grid">
        <article className="admin-stat-card"><p>Total orders</p><strong>{overview.totalOrders}</strong></article>
        <article className="admin-stat-card"><p>Paid orders</p><strong>{overview.paidOrders}</strong></article>
        <article className="admin-stat-card"><p>Products</p><strong>{overview.totalProducts}</strong></article>
        <article className="admin-stat-card"><p>Low stock</p><strong>{overview.lowStockProducts}</strong></article>
        <article className="admin-stat-card"><p>Customers</p><strong>{overview.totalCustomers}</strong></article>
        <article className="admin-stat-card"><p>Online now</p><strong>{userStats.onlineNow}</strong></article>
      </section>

      <section className="admin-alert-grid">
        {alerts.length ? (
          alerts.map((alert, index) => (
            <article key={`${alert.type}-${index}`} className="admin-alert-card admin-alert-warning">
              <h3>{alert.type?.replace(/_/g, " ") || "Alert"}</h3>
              <p>{alert.message}</p>
            </article>
          ))
        ) : (
          <article className="admin-alert-card admin-alert-info">
            <h3>No active alerts</h3>
            <p>Inventory and pricing alerts will appear here.</p>
          </article>
        )}
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card"><p>Last 24h</p><strong>{userStats.last24h}</strong></article>
        <article className="admin-stat-card"><p>Last 7d</p><strong>{userStats.last7d}</strong></article>
        <article className="admin-stat-card"><p>Last 30d</p><strong>{userStats.last30d}</strong></article>
        <article className="admin-stat-card"><p>Last 6m</p><strong>{userStats.last6m}</strong></article>
        <article className="admin-stat-card"><p>Last 1y</p><strong>{userStats.last1y}</strong></article>
        <article className="admin-stat-card"><p>Last 5y</p><strong>{userStats.last5y}</strong></article>
      </section>

      <section className="admin-panel admin-panel-wide">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {overview.recentOrders.length ? (
              overview.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id?.slice(-8)}</td>
                  <td>{order.customerId?.name || order.customerId?.email || "Customer"}</td>
                  <td>${Number(order.total || 0).toFixed(2)}</td>
                  <td>{order.paymentStatus || order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No orders available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;
