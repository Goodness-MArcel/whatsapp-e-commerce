"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  Eye,
  Download,
  Settings,
  LogOut,
} from "lucide-react";
import styles from "./dashboard.module.css";

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    // Fetch vendor data
    const fetchVendorData = async () => {
      try {
        const response = await fetch("/api/vendor/me");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/vendor/login");
            return;
          }
          throw new Error("Failed to fetch vendor data");
        }
        const data = await response.json();
        setVendor(data);
      } catch (err) {
        setError(err.message || "Error loading vendor data");
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/vendor/logout", { method: "POST" });
      router.push("/vendor/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push("/vendor/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Vendor Dashboard</h1>
          {vendor && <p className={styles.welcomeText}>Welcome, {vendor.name}</p>}
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.iconButton}
            title="Settings"
            onClick={() => router.push("/vendor/settings")}
          >
            <Settings size={20} />
          </button>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: "#3b82f6" }}>
              <ShoppingCart size={24} color="white" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Orders</p>
              <h3 className={styles.statValue}>{stats.totalOrders}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: "#10b981" }}>
              <TrendingUp size={24} color="white" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Revenue</p>
              <h3 className={styles.statValue}>
                ₹{stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: "#f59e0b" }}>
              <Package size={24} color="white" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Products</p>
              <h3 className={styles.statValue}>{stats.totalProducts}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: "#8b5cf6" }}>
              <Users size={24} color="white" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Customers</p>
              <h3 className={styles.statValue}>{stats.totalCustomers}</h3>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={() => router.push("/vendor/products")}
            >
              <Package size={20} />
              Manage Products
            </button>
            <button
              className={styles.actionButton}
              onClick={() => router.push("/vendor/orders")}
            >
              <ShoppingCart size={20} />
              View Orders
            </button>
            <button
              className={styles.actionButton}
              onClick={() => router.push("/vendor/analytics")}
            >
              <BarChart3 size={20} />
              Analytics
            </button>
            <button
              className={styles.actionButton}
              onClick={() => router.push("/vendor/settings")}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <h2>Recent Activity</h2>
            <button className={styles.viewAllButton}>View All</button>
          </div>
          <div className={styles.activityList}>
            <p className={styles.emptyState}>No recent activity yet</p>
          </div>
        </section>
      </main>
    </div>
  );
}
