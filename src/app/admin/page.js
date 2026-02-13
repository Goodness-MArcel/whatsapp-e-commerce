"use client";
import { useEffect, useState } from "react";
import { Users, Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      // You'll replace this with real API calls
      setStats([
        { label: "Total Users", value: "1,254", change: "+12%", trend: "up", icon: <Users /> },
        { label: "Total Products", value: "586", change: "+8%", trend: "up", icon: <Package /> },
        { label: "Revenue", value: "$24,580", change: "-2%", trend: "down", icon: <DollarSign /> },
        { label: "Conversion", value: "3.2%", change: "+0.5%", trend: "up", icon: <TrendingUp /> },
      ]);

      setRecentActivities([
        { user: "John Doe", action: "placed new order", time: "2 min ago" },
        { user: "Sarah Smith", action: "updated profile", time: "15 min ago" },
        { user: "Mike Johnson", action: "added product", time: "1 hour ago" },
        { user: "Admin", action: "changed settings", time: "2 hours ago" },
      ]);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <span className={`stat-change ${stat.trend}`}>
                {stat.change}
                {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </span>
            </div>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        <div className="content-left">
          {/* Recent Activities */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Activities</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-avatar">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>{activity.user}</strong> {activity.action}
                    </p>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-right">
          {/* Quick Stats */}
          <div className="content-card">
            <div className="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">892</span>
              </div>
              <div className="quick-stat">
                <span className="stat-label">Pending Orders</span>
                <span className="stat-value">42</span>
              </div>
              <div className="quick-stat">
                <span className="stat-label">Stock Alert</span>
                <span className="stat-value warning">15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}