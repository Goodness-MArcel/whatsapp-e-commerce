"use client";
import { UserProvider, useUser } from "../context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  Settings,
  Activity,
  LogOut,
  Package,
  Store,
} from "lucide-react";

// Create a separate component for the content that uses the context
function LayoutContent({ children, sidebarOpen, setSidebarOpen }) {
  const { userInfo, loading, error } = useUser();
  const pathname = usePathname();
  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/user/dashboard",
    },
    {
      name: "Profile",
      icon: <User size={20} />,
      href: "/user/dashboard/profile",
    },
    {
      name: "Products",
      icon: <Package size={20} />,
      href: "/user/dashboard/product",
    },
    { name: "Store", icon: <Store size={20} />, href: "/user/dashboard/store" },
    {
      name: "Activity Log",
      icon: <Activity size={20} />,
      href: "/user/dashboard/activity",
    },
  ];
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="text-danger mb-2" style={{ fontWeight: "5000" }}>
            {error.message || "An error occurred while fetching user data."}
          </div>
        </div>
      </div>
    );
  }

  // Show loading if needed
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Fixed Header with Toggle Button */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm fixed-top px-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link text-dark me-3 p-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ fontSize: "1.5rem" }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="navbar-brand fw-semibold mb-0">
              {userInfo?.store?.storeName || "User Dashboard"}
            </span>
          </div>

          <div className="d-flex align-items-center">
            <span className="text-secondary me-3 d-none d-md-inline">
              Welcome, {userInfo?.name || "Guest"}
            </span>
            <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Fixed Sidebar */}
      <div style={{ marginTop: "56px" }}>
        <div
          className="bg-white border-end shadow-sm position-fixed transition-all"
          style={{
            width: sidebarOpen ? "250px" : "0",
            height: "calc(100vh - 56px)",
            top: "56px",
            left: 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          <nav className="p-3" style={{ width: "250px" }}>
            <ul className="nav flex-column">
              {navItems.map((item) => (
                <li key={item.name} className="nav-item mb-2">
                  <Link
                    href={item.href}
                    className={`nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3 transition-all ${
                      pathname === item.href
                        ? "bg-success text-white"
                        : "text-dark hover-bg-success hover-bg-opacity-10"
                    }`}
                    style={{
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      className={
                        pathname === item.href ? "text-white" : "text-success"
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content - Adjusts based on sidebar state */}
        <main
          className="p-4 transition-all"
          style={{
            marginLeft: sidebarOpen ? "250px" : "0",
            width: sidebarOpen ? "calc(100% - 250px)" : "100%",
            minHeight: "calc(100vh - 56px)",
            transition: "margin-left 0.3s ease, width 0.3s ease",
          }}
        >
          {children}
        </main>
      </div>

      <style jsx>{`
        .hover-bg-success:hover {
          background-color: rgba(40, 167, 69, 0.1) !important;
          color: #28a745 !important;
        }
        .hover-bg-success:hover .text-success {
          color: #28a745 !important;
        }
      `}</style>
    </div>
  );
}

// Main layout component that provides the context
export default function UsersLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <UserProvider>
      <LayoutContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        {children}
      </LayoutContent>
    </UserProvider>
  );
}
