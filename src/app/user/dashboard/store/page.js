
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../context/UserContext";
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
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Store() {
  const { userInfo } = useUser();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showInStock, setShowInStock] = useState(false);
  
  const storeId = userInfo?.store?.id;

  // Fetch products
  const fetchProducts = async (page = 1) => {
    if (!storeId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/user/api/auth/products?storeId=${storeId}&page=${page}&limit=10`,
        {
           cache: 'force-cache', // Cache the response
        next: { 
          revalidate: 3600 // Revalidate every hour (optional)
        }
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        setPagination({
          page: data.page,
          total: data.total,
          totalPages: data.totalPages,
          limit: data.limit
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchProducts();
    }
  }, [storeId]);

  // Filter products by search and price
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = !priceRange.min || parseFloat(product.price) >= parseFloat(priceRange.min);
    const matchesMaxPrice = !priceRange.max || parseFloat(product.price) <= parseFloat(priceRange.max);
    const matchesStock = !showInStock || true; // Since all products in DB are in stock by default
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock;
  });

  // Calculate average rating (mock data since not in DB yet)
  const averageRating = 4.5;
  const totalReviews = 256;

  // Get unique categories from products
  const categories = ["All Products", ...new Set(products.map(p => p.category || "Uncategorized"))];

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary">Loading store products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Store Banner */}
      <div className="position-relative" style={{ height: "200px", backgroundColor: "#e9ecef" }}>
        {userInfo?.store?.logo ? (
          <Image
            src={userInfo.store.logo}
            alt={userInfo.store.storeName || "Store"}
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
                {userInfo?.store?.logo ? (
                  <Image
                    src={userInfo.store.logo}
                    alt={userInfo.store.storeName || "Store"}
                    width={60}
                    height={60}
                    className="rounded-circle"
                  />
                ) : (
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                       style={{ width: "60px", height: "60px" }}>
                    <StoreIcon size={30} className="text-success" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="h4 mb-1">{userInfo?.store?.storeName || "Store Name"}</h2>
                <p className="small mb-0 opacity-75">
                  {userInfo?.store?.description || "Store description"}
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
                  <small className="text-secondary">({totalReviews} reviews)</small>
                </div>
              </div>
              <div>
                <small className="text-secondary d-block">Products</small>
                <span className="fw-semibold d-flex align-items-center gap-1">
                  <Package size={14} className="text-success" />
                  {pagination.total}
                </span>
              </div>
              <div>
                <small className="text-secondary d-block">Joined</small>
                <span className="fw-semibold d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-success" />
                  {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <Heart size={16} className="me-1" />
                Follow Store
              </button>
              <button className="btn btn-success btn-sm">
                <MessageCircle size={16} className="me-1" />
                Contact via WhatsApp
              </button>
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
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
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
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary">
                  Showing {filteredProducts.length} of {pagination.total} products
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
                      <div key={product.id} className="col-md-4 col-sm-6">
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                          <div className="position-relative">
                            <div className="bg-light" style={{ height: "200px" }}>
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-fit-contain p-2"
                                />
                              ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                  <Package size={48} className="text-secondary opacity-50" />
                                </div>
                              )}
                            </div>
                            <button className="position-absolute top-0 end-0 btn btn-light btn-sm m-2 rounded-circle">
                              <Heart size={16} />
                            </button>
                          </div>
                          <div className="card-body">
                            <h6 className="card-title fw-semibold mb-1">
                              {product.name}
                            </h6>
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
                            <div className="d-flex align-items-center gap-2">
                              <span className="h5 mb-0 text-success">
                                ₦{parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-0 pt-0">
                            <button className="btn btn-outline-success w-100">
                              <ShoppingCart size={16} className="me-2" />
                              Add to Cart
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
                      <div key={product.id} className="card border-0 shadow-sm">
                        <div className="row g-0">
                          <div className="col-md-3">
                            <div className="bg-light" style={{ height: "150px" }}>
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-fit-contain p-3"
                                />
                              ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                  <Package size={48} className="text-secondary opacity-50" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-9">
                            <div className="card-body">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <h5 className="card-title fw-semibold">
                                    {product.name}
                                  </h5>
                                  <p className="card-text small text-secondary">
                                    {product.description || "No description available"}
                                  </p>
                                  <p className="card-text">
                                    <span className="h5 text-success">
                                      ₦{parseFloat(product.price).toFixed(2)}
                                    </span>
                                  </p>
                                  <small className="text-secondary">
                                    Added {new Date(product.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                  <button className="btn btn-success">
                                    <ShoppingCart size={16} className="me-2" />
                                    Add to Cart
                                  </button>
                                  <button className="btn btn-outline-success">
                                    <MessageCircle size={16} className="me-2" />
                                    WhatsApp
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => fetchProducts(pagination.page - 1)}
                        >
                          <ChevronLeft size={16} />
                        </button>
                      </li>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => fetchProducts(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => fetchProducts(pagination.page + 1)}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;