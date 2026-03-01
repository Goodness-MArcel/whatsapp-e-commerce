"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import CompactCart from "../../components/CartSidebar";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Filter,
  Grid,
  List,
  MessageCircle,
  Store as StoreIcon,
  Package,
  Calendar,
  MapPin,
  ChevronDown,
  Check,
} from "lucide-react";

export default function StoreContent({ storeData, storeSlug }) {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState(storeData.Products || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showInStock, setShowInStock] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  const { addToCart, cart, getCartCount } = useCart();

  // Filter products by search, price, and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice =
      !priceRange.min ||
      parseFloat(product.price) >= parseFloat(priceRange.min);
    const matchesMaxPrice =
      !priceRange.max ||
      parseFloat(product.price) <= parseFloat(priceRange.max);
    const matchesCategory =
      selectedCategory === "all" ||
      (product.category && product.category.toLowerCase() === selectedCategory);

    return (
      matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCategory
    );
  });

  // Handle add to cart with animation - only updates count, doesn't open cart
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1, storeData);

    // Show added animation
    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  // Mock rating data (since not in DB)
  const averageRating = 4.5;
  const totalReviews = 256;

  // Get unique categories from products
  const categories = [
    "All Products",
    ...new Set(products.map((p) => p.category || "Uncategorized")),
  ];

  const cartCount = getCartCount();

  return (
    <>
      {/* <CompactCart show={showCart} onClose={() => setShowCart(false)} /> */}

      <CompactCart
        show={showCart}
        onClose={() => setShowCart(false)}
        storeData={storeData} // Pass storeData here
      />

      {/* Floating Cart Button */}
      <button
        className="btn btn-light position-fixed rounded-circle p-2 border-0 shadow"
        onClick={toggleCart}
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050,
          bottom: "20px",
          right: "20px",
          backgroundColor: "white",
          transition: "all 0.3s ease",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <ShoppingCart size={22} className="text-success" />
        {cartCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success text-white"
            style={{
              fontSize: "11px",
              minWidth: "20px",
              height: "20px",
              lineHeight: "20px",
              padding: 0,
              fontWeight: "600",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      <div className="bg-light min-vh-100">
        {/* Store Banner */}
        <div
          className="position-relative"
          style={{ height: "200px", backgroundColor: "#e9ecef" }}
        >
          {storeData.logo ? (
            <Image
              src={storeData.logo}
              alt={storeData.storeName || "Store"}
              fill
              className="object-fit-cover"
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-success bg-opacity-10">
              <StoreIcon size={48} className="text-success opacity-50" />
            </div>
          )}
          <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white p-3">
            <div className="container">
              <div className="d-flex align-items-center gap-3">
                {/* Store Logo */}
                <div className="rounded-circle bg-white p-1">
                  {storeData.logo ? (
                    <Image
                      src={storeData.logo}
                      alt={storeData.storeName || "Store"}
                      width={60}
                      height={60}
                      className="rounded-circle"
                    />
                  ) : (
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <StoreIcon size={30} className="text-success" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="h4 mb-1">
                    {storeData.storeName || "Store Name"}
                  </h2>
                  <p className="small mb-0 opacity-75">
                    {storeData.description || "Store description"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Stats Bar */}
        <div className="bg-white border-bottom shadow-sm">
          <div className="container py-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex gap-4 flex-wrap">
                <div>
                  <small className="text-secondary d-block">Rating</small>
                  <div className="d-flex align-items-center gap-1">
                    <Star size={16} className="text-warning fill-warning" />
                    <span className="fw-semibold">{averageRating}</span>
                    <small className="text-secondary">
                      ({totalReviews} reviews)
                    </small>
                  </div>
                </div>
                <div>
                  <small className="text-secondary d-block">Products</small>
                  <span className="fw-semibold d-flex align-items-center gap-1">
                    <Package size={14} className="text-success" />
                    {products.length}
                  </span>
                </div>
                {storeData.city && storeData.country && (
                  <div>
                    <small className="text-secondary d-block">Location</small>
                    <span className="fw-semibold d-flex align-items-center gap-1">
                      <MapPin size={14} className="text-success" />
                      {storeData.city}, {storeData.country}
                    </span>
                  </div>
                )}
                <div>
                  <small className="text-secondary d-block">Joined</small>
                  <span className="fw-semibold d-flex align-items-center gap-1">
                    <Calendar size={14} className="text-success" />
                    {new Date().getFullYear()}
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-success btn-sm">
                  <Heart size={16} className="me-1" />
                  Follow Store
                </button>
                {storeData.whatsappNumber && (
                  <a
                    href={`https://wa.me/${storeData.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    <MessageCircle size={16} className="me-1" />
                    Contact via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-4">
          <div className="row">
            {/* Sidebar - Categories */}
            <div className="col-lg-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-semibold mb-0">Categories</h5>
                </div>
                <div className="list-group list-group-flush">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`list-group-item list-group-item-action border-0 py-2 ${
                        selectedCategory === category.toLowerCase()
                          ? "active bg-success text-white"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCategory(
                          category.toLowerCase() === "all products"
                            ? "all"
                            : category.toLowerCase(),
                        )
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Card */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-semibold mb-0">
                    <Filter size={18} className="me-2" />
                    Filters
                  </h5>
                </div>
                <div className="card-body">
                  <h6 className="small fw-semibold mb-2">Price Range ($)</h6>
                  <div className="d-flex gap-2 mb-3">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </div>

                  <h6 className="small fw-semibold mb-2">Availability</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="inStock"
                      checked={showInStock}
                      onChange={(e) => setShowInStock(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="inStock">
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Store Info Card */}
              {storeData.address && (
                <div className="card border-0 shadow-sm mt-4">
                  <div className="card-body">
                    <h6 className="fw-semibold mb-2">Store Address</h6>
                    <p className="small text-secondary mb-0">
                      <MapPin size={14} className="me-1 text-success" />
                      {storeData.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-secondary">
                    Showing {filteredProducts.length} of {products.length}{" "}
                    products
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <div
                    className="input-group input-group-sm"
                    style={{ width: "200px" }}
                  >
                    <span className="input-group-text bg-white border-end-0">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    className={`btn btn-sm ${viewMode === "list" ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                  <Package size={48} className="text-secondary mb-3" />
                  <h5>No products found</h5>
                  <p className="text-secondary">Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  {/* Products Grid/List View */}
                  {viewMode === "grid" ? (
                    <div className="row g-3">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="col-6 col-md-4">
                          <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                            <Link
                              href={`/store/${storeSlug}/product/${product.id}`}
                            >
                              <div className="position-relative">
                                <div
                                  className="bg-light"
                                  style={{ height: "200px" }}
                                >
                                  {product.image ? (
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-fit-contain p-2"
                                    />
                                  ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                      <Package
                                        size={48}
                                        className="text-secondary opacity-50"
                                      />
                                    </div>
                                  )}
                                </div>
                                <button className="position-absolute top-0 end-0 btn btn-light btn-sm m-2 rounded-circle">
                                  <Heart size={16} />
                                </button>
                              </div>
                            </Link>
                            <div className="card-body">
                              <Link
                                href={`/store/${storeSlug}/product/${product.id}`}
                                className="text-decoration-none text-dark"
                              >
                                <h6 className="card-title fw-semibold mb-1">
                                  {product.name}
                                </h6>
                              </Link>
                              <p className="small text-secondary mb-2">
                                {product.description?.substring(0, 50)}
                                {product.description?.length > 50 ? "..." : ""}
                              </p>
                              <div className="d-flex align-items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={
                                      i < Math.floor(4.5)
                                        ? "text-warning fill-warning"
                                        : "text-secondary"
                                    }
                                  />
                                ))}
                                <small className="text-secondary ms-1">
                                  (0)
                                </small>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <span className="h5 mb-0 text-success">
                                  ${parseFloat(product.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="card-footer bg-white border-0 pt-0">
                              <button
                                className={`btn w-100 ${
                                  addedToCart[product.id]
                                    ? "btn-success"
                                    : isInCart(product.id)
                                      ? "btn-outline-success"
                                      : "btn-outline-success"
                                }`}
                                onClick={(e) => handleAddToCart(product, e)}
                              >
                                {addedToCart[product.id] ? (
                                  <>
                                    <Check size={16} className="me-2" />
                                    Added!
                                  </>
                                ) : isInCart(product.id) ? (
                                  <>
                                    <ShoppingCart size={16} className="me-2" />
                                    Add More
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart size={16} className="me-2" />
                                    Add to Cart
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // List View
                    <div className="d-flex flex-column gap-3">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="card border-0 shadow-sm"
                        >
                          <div className="row g-0">
                            <div className="col-md-3">
                              <Link
                                href={`/store/${storeSlug}/product/${product.id}`}
                              >
                                <div
                                  className="bg-light"
                                  style={{ height: "150px", cursor: "pointer" }}
                                >
                                  {product.image ? (
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-fit-contain p-3"
                                    />
                                  ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                      <Package
                                        size={48}
                                        className="text-secondary opacity-50"
                                      />
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </div>
                            <div className="col-md-9">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <Link
                                      href={`/store/${storeSlug}/product/${product.id}`}
                                      className="text-decoration-none text-dark"
                                    >
                                      <h5 className="card-title fw-semibold">
                                        {product.name}
                                      </h5>
                                    </Link>
                                    <p className="card-text small text-secondary">
                                      {product.description ||
                                        "No description available"}
                                    </p>
                                    <div className="d-flex align-items-center gap-1 mb-2">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          className={
                                            i < Math.floor(4.5)
                                              ? "text-warning fill-warning"
                                              : "text-secondary"
                                          }
                                        />
                                      ))}
                                      <small className="text-secondary ms-1">
                                        (0)
                                      </small>
                                    </div>
                                    <p className="card-text">
                                      <span className="h5 text-success">
                                        ${parseFloat(product.price).toFixed(2)}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="d-flex flex-column gap-2">
                                    <button
                                      className={`btn ${
                                        addedToCart[product.id]
                                          ? "btn-success"
                                          : isInCart(product.id)
                                            ? "btn-outline-success"
                                            : "btn-success"
                                      }`}
                                      onClick={(e) =>
                                        handleAddToCart(product, e)
                                      }
                                    >
                                      {addedToCart[product.id] ? (
                                        <>
                                          <Check size={16} className="me-2" />
                                          Added!
                                        </>
                                      ) : isInCart(product.id) ? (
                                        <>
                                          <ShoppingCart
                                            size={16}
                                            className="me-2"
                                          />
                                          Add More
                                        </>
                                      ) : (
                                        <>
                                          <ShoppingCart
                                            size={16}
                                            className="me-2"
                                          />
                                          Add to Cart
                                        </>
                                      )}
                                    </button>
                                    {storeData.whatsappNumber && (
                                      <a
                                        href={`https://wa.me/${storeData.whatsappNumber.replace(/\D/g, "")}?text=Hi, I'm interested in ${product.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-success"
                                      >
                                        <MessageCircle
                                          size={16}
                                          className="me-2"
                                        />
                                        WhatsApp
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .hover-shadow:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
            transition: all 0.2s ease;
          }
          .fill-warning {
            fill: #ffc107;
          }
        `}</style>
      </div>
    </>
  );
}
