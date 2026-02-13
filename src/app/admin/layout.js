"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Package,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  HelpCircle,
  User,
  FileText,
  ShoppingCart,
  DollarSign
} from "lucide-react";
import "./admin.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  // NAVIGATION ITEMS - YOU WERE MISSING THIS!
  const navItems = [
    { id: "/admin", label: "Dashboard", icon: <Home size={20} /> },
    { id: "/admin/users", label: "Users", icon: <Users size={20} />, badge: "12" },
    
    { id: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { id: "/admin/reports", label: "Reports", icon: <FileText size={20} /> },
    { id: "/admin/finance", label: "Finance", icon: <DollarSign size={20} /> },
    { id: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Mock user data - you'll replace this with real data
  const user = { username: "Admin", email: "admin@example.com" };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">A</div>
            {sidebarOpen && <h2 className="brand-text">AdminPanel</h2>}
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="user-info">
          <div className="avatar">
            <User size={24} />
          </div>
          {sidebarOpen && (
            <div className="user-details">
              <h4>{user?.username}</h4>
              <span className="role-badge">Administrator</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.id}
              className={`nav-item ${pathname === item.id ? "active" : ""} text-decoration-none`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {navItems.find(item => item.id === pathname)?.label || "Dashboard"}
            </h1>
            <p className="page-subtitle">
              {pathname === "/admin" 
                ? "Welcome back!" 
                : `Manage your ${navItems.find(item => item.id === pathname)?.label.toLowerCase()}`
              }
            </p>
          </div>
          
          <div className="header-right">
            <button className="header-btn notification-btn">
              <Bell size={20} />
              {notifications > 0 && <span className="notification-dot">{notifications}</span>}
            </button>
            
            <button className="header-btn help-btn">
              <HelpCircle size={20} />
            </button>
            
            <div className="user-dropdown">
              <div className="dropdown-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="dropdown-info">
                  <span className="dropdown-name">{user?.username}</span>
                  <span className="dropdown-email">{user?.email}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}