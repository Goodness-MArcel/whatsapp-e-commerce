"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { useUser } from '@/context/UserContext  ';
import { useUser } from "../../context/UserContext";
import { Copy, CheckCircle } from "lucide-react";

function Profile() {
  const { userInfo, products } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!userInfo?.store?.slug) return;

    const fullUrl = `${window.location.origin}/store/${userInfo.store.slug}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Static user data
  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Full-stack developer passionate about creating amazing web experiences.",
    profileImage: null, // Set to null to show initials avatar, or add a path for image
    created_at: "2023-01-15T10:30:00Z",
    isVerified: true,
    isVendor: true,
    store: {
      id: 101,
      storeName: "Digital Dreams Shop",
      storecategory: "Electronics & Gadgets",
      whatsappNumber: "+1 (555) 987-6543",
      country: "United States",
      city: "New York",
      address: "123 Tech Avenue, Suite 456",
      description:
        "Your one-stop shop for the latest tech gadgets and accessories.",
      slug: "digital-dreams-shop",
      logo: null,
      createdAt: "2023-02-20T14:15:00Z",
      updatedAt: "2024-01-10T09:30:00Z",
    },
  };

  // Recent activity data
  const recentActivities = [
    {
      id: 1,
      action: "Logged in from new device",
      time: "2 hours ago",
      type: "login",
    },
    {
      id: 2,
      action: "Updated profile information",
      time: "Yesterday",
      type: "update",
    },
    {
      id: 3,
      action: "Added new product to store",
      time: "3 days ago",
      type: "product",
    },
    {
      id: 4,
      action: "Changed password",
      time: "1 week ago",
      type: "security",
    },
  ];

  // Account statistics
  const accountStats = {
    productsListed: 24,
    totalSales: 156,
    reviewsReceived: 42,
    wishlistItems: 18,
  };

  // Get initial for avatar
  const getInitial = () => {
    return user.name?.charAt(0).toUpperCase() || "U";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Page Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="h2 mb-1 fw-semibold">{userInfo?.name}</h1>
            <p className="text-muted mb-0">
              Manage your personal information and account settings
            </p>
          </div>
          <Link href="/profile/edit" className="btn btn-primary px-4">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Profile
          </Link>
        </div>

        {/* Stats Cards Row */}
        {user.isVendor && (
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-box-seam text-primary"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1 small">Products</h6>
                      <h4 className="mb-0 fw-bold">{products?.total}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-cart-check text-success"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1 small">Total Sales</h6>
                      <h4 className="mb-0 fw-bold">
                        {accountStats.totalSales}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-star text-warning"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1 small">Reviews</h6>
                      <h4 className="mb-0 fw-bold">
                        {accountStats.reviewsReceived}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-heart text-info"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1 small">Wishlist</h6>
                      <h4 className="mb-0 fw-bold">
                        {accountStats.wishlistItems}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Content Row */}
        <div className="row g-4">
          {/* Left Column - Profile Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center p-4">
                {/* Profile Image */}
                <div className="position-relative d-inline-block mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-1">
                    {userInfo?.store?.logo ? (
                      <Image
                        src={userInfo?.store?.logo || "/default-avatar.png"}
                        alt={user.name}
                        width={120}
                        height={120}
                        className="rounded-circle"
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-gradient-primary text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "120px",
                          height: "120px",
                          fontSize: "3rem",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        {getInitial()}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 shadow-sm border"
                    onClick={() => alert("Image upload functionality")}
                  >
                    <i className="bi bi-camera"></i>
                  </button>
                </div>

                <h5 className="mb-1 fw-semibold">{userInfo?.name}</h5>
                <p className="text-muted small mb-3">{userInfo?.email}</p>

                {/* Account Status */}
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {user.isVerified && (
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                      <i className="bi bi-check-circle-fill me-1"></i>
                      Verified
                    </span>
                  )}
                  {user.isVendor && (
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                      <i className="bi bi-shop me-1"></i>
                      Vendor
                    </span>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-muted small border-top pt-3 mt-2">
                    {userInfo?.store?.description}
                  </p>
                )}

                {/* Member Since */}
                <div className="text-muted small border-top pt-3">
                  <i className="bi bi-calendar3 me-2"></i>
                  Member since {formatDate(userInfo?.store?.createdAt)}
                  <br />
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body">
                <h6 className="card-title mb-3 fw-semibold">
                  <i className="bi bi-lightning-charge me-2 text-primary"></i>
                  Quick Actions
                </h6>
                <div className="d-grid gap-2">
                  <Link
                    href="/profile/security"
                    className="btn btn-outline-secondary text-start d-flex align-items-center"
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    <span>Security Settings</span>
                    <i className="bi bi-chevron-right ms-auto"></i>
                  </Link>
                  <Link
                    href="/profile/notifications"
                    className="btn btn-outline-secondary text-start d-flex align-items-center"
                  >
                    <i className="bi bi-bell me-2"></i>
                    <span>Notification Preferences</span>
                    <i className="bi bi-chevron-right ms-auto"></i>
                  </Link>
                  {user.isVendor && (
                    <Link
                      href="/profile/billing"
                      className="btn btn-outline-secondary text-start d-flex align-items-center"
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      <span>Billing Information</span>
                      <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                  )}
                  <Link
                    href="/profile/delete"
                    className="btn btn-outline-danger text-start d-flex align-items-center"
                  >
                    <i className="bi bi-trash me-2"></i>
                    <span>Delete Account</span>
                    <i className="bi bi-chevron-right ms-auto"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs and Details */}
          <div className="col-lg-8">
            {/* Tabs Navigation */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "profile" ? "active fw-semibold" : ""}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <i className="bi bi-person me-2"></i>
                      Personal Info
                    </button>
                  </li>
                  {user.isVendor && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "store" ? "active fw-semibold" : ""}`}
                        onClick={() => setActiveTab("store")}
                      >
                        <i className="bi bi-shop me-2"></i>
                        Store Details
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "activity" ? "active fw-semibold" : ""}`}
                      onClick={() => setActiveTab("activity")}
                    >
                      <i className="bi bi-activity me-2"></i>
                      Activity
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {/* Personal Info Tab */}
                {activeTab === "profile" && (
                  <div>
                    <h5 className="mb-4 fw-semibold">Personal Information</h5>

                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="text-muted small mb-1">
                          Full Name
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.name || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small mb-1">
                          Email Address
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small mb-1">
                          Phone Number
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.whatsappNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small mb-1">
                          Location
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.city || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Store Tab */}
                {activeTab === "store" && user.isVendor && user.store && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h5 className="fw-semibold mb-0">Store Information</h5>
                      <Link
                        href="/store/manage"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-gear me-2"></i>
                        Manage Store
                      </Link>
                    </div>

                    <div className="row g-4 ">
                      <div className="col-md-6">
                        <label className="text-muted small mb-1">
                          Store Name
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.storeName || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small mb-1">
                          Category
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.storecategory || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small mb-1">
                          WhatsApp Number
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            <i className="bi bi-whatsapp text-success me-2"></i>
                            {userInfo?.store?.whatsappNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="text-muted small mb-1">Country</label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.country || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <label className="text-muted small mb-1">City</label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.city || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6 position-relative">
                        {copied && (
                          <div className="position-absolute top-0 end-0 mt-2 me-2">
                            <div className="alert alert-success d-flex align-items-center gap-2 mb-0 py-2 px-3 shadow-sm">
                              <CheckCircle size={18} className="text-success" />
                              <span className="mb-0 small fw-semibold">Copied!</span>
                            </div>
                          </div>
                        )}
                        <label className="text-muted small mb-1">
                          Store URL
                        </label>
                        <div className="bg-light rounded p-3 d-flex justify-content-between align-items-center">
                          <p
                            className="fw-medium mb-0 text-primary"
                            style={{
                              wordBreak: "break-all",
                              fontSize: "0.9rem",
                            }}
                          >
                            /{userInfo?.store?.slug || "Not provided"}
                          </p>

                          <button
                            onClick={handleCopy}
                            className="btn btn-sm btn-outline-none border border-none d-flex align-items-center gap-1"
                            style={{ fontSize: "0.8rem" }}
                          >
                            <Copy size={16} />
                            {/* {copied ? "Copied!" : "Copy"} */}
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="text-muted small mb-1">Address</label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small mb-1">
                          Description
                        </label>
                        <div className="bg-light rounded p-3">
                          <p className="fw-medium mb-0">
                            {userInfo?.store?.description || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                  <div>
                    <h5 className="mb-4 fw-semibold">Recent Activity</h5>

                    <div className="position-relative">
                      {recentActivities.map((activity, index) => (
                        <div key={activity.id} className="d-flex mb-4">
                          <div className="me-3">
                            <div
                              className={`rounded-circle p-2 ${
                                activity.type === "login"
                                  ? "bg-primary"
                                  : activity.type === "update"
                                    ? "bg-success"
                                    : activity.type === "product"
                                      ? "bg-warning"
                                      : "bg-info"
                              } bg-opacity-10`}
                            >
                              <i
                                className={`bi ${
                                  activity.type === "login"
                                    ? "bi-box-arrow-in-right"
                                    : activity.type === "update"
                                      ? "bi-pencil"
                                      : activity.type === "product"
                                        ? "bi-box"
                                        : "bi-shield"
                                } ${
                                  activity.type === "login"
                                    ? "text-primary"
                                    : activity.type === "update"
                                      ? "text-success"
                                      : activity.type === "product"
                                        ? "text-warning"
                                        : "text-info"
                                }`}
                              ></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 pb-3 border-bottom">
                            <p className="mb-1 fw-medium">{activity.action}</p>
                            <small className="text-muted">
                              {activity.time}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
