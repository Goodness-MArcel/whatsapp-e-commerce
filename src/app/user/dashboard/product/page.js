"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../context/UserContext";
import { deleteProduct, updateProduct, duplicateProduct } from "./test";

import {
  Search,
  PlusCircle,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Grid,
  List,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Dropdown } from "react-bootstrap";

function Products() {
  const { userInfo, products: contextProducts } = useUser();

  const [viewMode, setViewMode] = useState("grid");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  //update product & Edit States
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'delete'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 12,
  });

  const storeId = userInfo?.store?.id;

  // Extract products array from context response
  const productsArray = contextProducts?.products || [];

  // Process products from context
  useEffect(() => {
   displayProducts();
  }, [contextProducts]);

  function displayProducts(){
     if (productsArray.length > 0) {
      // Add mock data for fields not in your actual product model
      const enhancedProducts = productsArray.map((product) => ({
        ...product,
        // Add mock data for display purposes (remove when you have real data)
        originalPrice: parseFloat(product.price) * 1.2, // 20% higher as original price
        category: product.category || "Uncategorized",
        stock: Math.floor(Math.random() * 50) + 1, // Random stock 1-50
        sold: Math.floor(Math.random() * 100), // Random sold count
        views: Math.floor(Math.random() * 1000) + 100, // Random views
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating 3-5
        status: Math.random() > 0.2 ? "active" : "out_of_stock", // Random status
      }));

      setFilteredProducts(enhancedProducts);
      setPagination((prev) => ({
        ...prev,
        total: enhancedProducts.length,
        totalPages: Math.ceil(enhancedProducts.length / prev.limit),
      }));
      setLoading(false);
    } else {
      setFilteredProducts([]);
      setLoading(false);
    }
  }

  // Filter and sort products
  useEffect(() => {
    if (!productsArray.length) return;

    let filtered = [...productsArray].map((product) => ({
      ...product,
      // Add mock data for filtering (remove when you have real data)
      originalPrice: parseFloat(product.price) * 1.2,
      category: product.category || "Uncategorized",
      stock: Math.floor(Math.random() * 50) + 1,
      sold: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 1000) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: Math.random() > 0.2 ? "active" : "out_of_stock",
    }));

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Apply price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(priceRange.min),
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(priceRange.max),
      );
    }

    // Apply stock filter
    if (stockFilter === "in_stock") {
      filtered = filtered.filter((product) => product.stock > 0);
    } else if (stockFilter === "out_of_stock") {
      filtered = filtered.filter((product) => product.stock === 0);
    } else if (stockFilter === "low_stock") {
      filtered = filtered.filter(
        (product) => product.stock > 0 && product.stock < 10,
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price_high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
    setPagination((prev) => ({
      ...prev,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit),
    }));
  }, [
    productsArray,
    searchTerm,
    selectedCategory,
    priceRange,
    stockFilter,
    sortBy,
  ]);

  // Calculate KPI metrics from actual products
  const totalProducts = productsArray.length || 0;
  const totalValue =
    productsArray.reduce((sum, p) => sum + parseFloat(p.price), 0) || 0;
  const avgPrice =
    totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0;

  // Get unique categories from products
  const categories = [
    "All",
    ...new Set(productsArray.map((p) => p.category || "Uncategorized") || []),
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
            <CheckCircle size={12} className="me-1" /> Active
          </span>
        );
      case "out_of_stock":
        return (
          <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-pill">
            <XCircle size={12} className="me-1" /> Out of Stock
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded-pill">
            <Clock size={12} className="me-1" /> Draft
          </span>
        );
    }
  };

  // Custom toggle for dropdown to prevent event bubbling
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      href=""
      ref={ref}
      className="btn btn-light btn-sm rounded-circle"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  CustomToggle.displayName = "CustomToggle";

  // Modal handlers
  const openViewModal = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category: product.category,
      stock: product.stock,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setModalMode("delete");
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!selectedProduct) return;
      setIsUpdating(true);
      setApiError(null);

      // Here you would call your API to update the product
      //   console.log("Updating product:", selectedProduct.id, editFormData);
      const updatedProduct = await updateProduct(
        selectedProduct.id,
        editFormData,
      );
      displayProducts()

      // Update local state (mock)
      const updatedProducts = filteredProducts.map((p) =>
        p.id === selectedProduct.id ? { ...p, ...updatedProduct } : p,
      );
      
      setFilteredProducts(updatedProducts);
      setShowModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedProduct) return;

    // Here you would call your API to delete the product
    console.log("Deleting product:", selectedProduct.id);

    // Update local state (mock)
    const updatedProducts = filteredProducts.filter(
      (p) => p.id !== selectedProduct.id,
    );
    setFilteredProducts(updatedProducts);
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDuplicate = (product) => {
    // Here you would call your API to duplicate the product
    console.log("Duplicating product:", product.id);

    // Mock duplicate
    const newProduct = {
      ...product,
      id: Date.now(),
      name: `${product.name} (Copy)`,
    };
    setFilteredProducts([...filteredProducts, newProduct]);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredProducts.slice(start, end);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Products</h2>
          <p className="text-secondary small mb-0">
            Manage your product catalog and inventory
          </p>
        </div>
        <Link
          href="/products/add"
          className="btn btn-success d-flex align-items-center gap-2 py-2 px-3"
        >
          <PlusCircle size={18} />
          Add New Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 rounded-3 p-3">
                <Package size={24} className="text-success" />
              </div>
              <div>
                <small className="text-secondary d-block">Total Products</small>
                <h4 className="fw-bold mb-0">{totalProducts}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 rounded-3 p-3">
                <DollarSign size={24} className="text-success" />
              </div>
              <div>
                <small className="text-secondary d-block">Total Value</small>
                <h4 className="fw-bold mb-0">₦{totalValue.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 rounded-3 p-3">
                <TrendingUp size={24} className="text-success" />
              </div>
              <div>
                <small className="text-secondary d-block">Average Price</small>
                <h4 className="fw-bold mb-0">₦{avgPrice}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <Search size={18} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </button>
              <button
                className={`btn btn-sm ${viewMode === "grid" ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === "list" ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="row g-3 mt-3 pt-3 border-top">
            <div className="col-md-3">
              <label className="small fw-semibold text-secondary mb-1">
                Category
              </label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="small fw-semibold text-secondary mb-1">
                Price Range
              </label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="small fw-semibold text-secondary mb-1">
                Stock Status
              </label>
              <select
                className="form-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="low_stock">Low Stock (&lt;10)</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="small fw-semibold text-secondary mb-1">
                Sort By
              </label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="name">Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products Count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-secondary">
          Showing {getCurrentPageProducts().length} of {filteredProducts.length}{" "}
          products
        </span>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3 shadow-sm p-5 text-center">
          <Package size={48} className="text-secondary mb-3" />
          <h5>No products found</h5>
          <p className="text-secondary mb-3">
            Try adjusting your search or filters
          </p>
          <Link href="/products/add" className="btn btn-success">
            <PlusCircle size={16} className="me-2" />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="row g-3">
              {getCurrentPageProducts().map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <div className="position-relative">
                      <div className="bg-light" style={{ height: "180px" }}>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: "0.5rem",
                            }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <Package
                              size={40}
                              className="text-secondary opacity-50"
                            />
                          </div>
                        )}
                      </div>

                      {/* React Bootstrap Dropdown */}
                      <div className="position-absolute top-0 end-0 m-2">
                        <Dropdown>
                          <Dropdown.Toggle as={CustomToggle}>
                            <MoreVertical size={14} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            align="end"
                            className="shadow-sm border-0 py-1"
                          >
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2 py-2"
                              onClick={() => openViewModal(product)}
                            >
                              <Eye size={14} className="text-secondary" /> View
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2 py-2"
                              onClick={() => openEditModal(product)}
                            >
                              <Edit size={14} className="text-secondary" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2 py-2"
                              onClick={() => handleDuplicate(product)}
                            >
                              <Copy size={14} className="text-secondary" />{" "}
                              Duplicate
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2 py-2 text-danger"
                              onClick={() => openDeleteModal(product)}
                            >
                              <Trash2 size={14} /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      {product.originalPrice > product.price && (
                        <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                          -
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100,
                          )}
                          %
                        </span>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-1 mb-2">
                        {getStatusBadge(product.status)}
                      </div>
                      <h6 className="fw-semibold mb-1">{product.name}</h6>
                      <p className="small text-secondary mb-2">
                        {product.description?.substring(0, 40)}...
                      </p>
                      <div className="d-flex align-items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(product.rating)
                                ? "text-warning fill-warning"
                                : "text-secondary"
                            }
                          />
                        ))}
                        <small className="text-secondary ms-1">
                          ({product.sold})
                        </small>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="fw-bold text-success">
                            ₦{parseFloat(product.price).toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <small className="text-secondary text-decoration-line-through ms-2">
                              ${product.originalPrice.toFixed(2)}
                            </small>
                          )}
                        </div>
                        <small className="text-secondary">
                          {product.stock} in stock
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-3 shadow-sm overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageProducts().map((product) => (
                    <tr key={product.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-light rounded-3"
                            style={{ width: "50px", height: "50px" }}
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  padding: "0.25rem",
                                }}
                              />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <Package
                                  size={20}
                                  className="text-secondary opacity-50"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-0">{product.name}</h6>
                            <small className="text-secondary">
                              {product.description?.substring(0, 30)}...
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold">
                          ₦{parseFloat(product.price).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            product.stock === 0 ? "text-danger fw-semibold" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <Dropdown>
                            <Dropdown.Toggle as={CustomToggle}>
                              <MoreVertical size={14} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                              align="end"
                              className="shadow-sm border-0 py-1"
                            >
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2 py-2"
                                onClick={() => openViewModal(product)}
                              >
                                <Eye size={14} className="text-secondary" />{" "}
                                View
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2 py-2"
                                onClick={() => openEditModal(product)}
                              >
                                <Edit size={14} className="text-secondary" />{" "}
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2 py-2"
                                onClick={() => handleDuplicate(product)}
                              >
                                <Copy size={14} className="text-secondary" />{" "}
                                Duplicate
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2 py-2 text-danger"
                                onClick={() => openDeleteModal(product)}
                              >
                                <Trash2 size={14} /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                  >
                    <ChevronLeft size={16} />
                  </button>
                </li>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${pagination.page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: i + 1 }))
                      }
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                  >
                    <ChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Product Modal - View/Edit/Delete */}
      {showModal && selectedProduct && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-white rounded-4 p-4"
            style={{
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                {modalMode === "view" && (
                  <Eye size={24} className="text-success" />
                )}
                {modalMode === "edit" && (
                  <Edit size={24} className="text-success" />
                )}
                {modalMode === "delete" && (
                  <AlertTriangle size={24} className="text-danger" />
                )}
                <h5 className="fw-bold mb-0">
                  {modalMode === "view" && "Product Details"}
                  {modalMode === "edit" && "Edit Product"}
                  {modalMode === "delete" && "Delete Product"}
                </h5>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-light rounded-circle p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            {modalMode === "view" && (
              <div>
                {/* Product Image */}
                <div className="text-center mb-4">
                  <div
                    className="bg-light rounded-3 d-inline-block p-4"
                    style={{ width: "200px", height: "200px" }}
                  >
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Package
                        size={80}
                        className="text-secondary opacity-50"
                      />
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">{selectedProduct.name}</h4>
                    {getStatusBadge(selectedProduct.status)}
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-3">
                        <small className="text-secondary d-block">Price</small>
                        <span className="h5 mb-0 text-success">
                          ${parseFloat(selectedProduct.price).toFixed(2)}
                        </span>
                        {selectedProduct.originalPrice >
                          selectedProduct.price && (
                          <small className="text-secondary text-decoration-line-through d-block">
                            ${selectedProduct.originalPrice.toFixed(2)}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-3">
                        <small className="text-secondary d-block">Stock</small>
                        <span className="h5 mb-0">
                          {selectedProduct.stock} units
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-3">
                        <small className="text-secondary d-block">
                          Category
                        </small>
                        <span className="fw-semibold">
                          {selectedProduct.category}
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-3">
                        <small className="text-secondary d-block">Rating</small>
                        <div className="d-flex align-items-center gap-1">
                          <Star
                            size={16}
                            className="text-warning fill-warning"
                          />
                          <span className="fw-semibold">
                            {selectedProduct.rating}
                          </span>
                          <small className="text-secondary">
                            ({selectedProduct.sold} sold)
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-light rounded-3 p-3">
                        <small className="text-secondary d-block">
                          Description
                        </small>
                        <p className="mb-0">
                          {selectedProduct.description ||
                            "No description available"}
                        </p>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-light rounded-3 p-3">
                        <small className="text-secondary d-block">
                          Product ID
                        </small>
                        <code className="small">{selectedProduct.id}</code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-success flex-fill py-2"
                    onClick={() => {
                      setModalMode("edit");
                      setEditFormData({
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        description: selectedProduct.description || "",
                        category: selectedProduct.category,
                        stock: selectedProduct.stock,
                      });
                    }}
                  >
                    <Edit size={16} className="me-2" />
                    Edit Product
                  </button>
                  <button
                    className="btn btn-outline-danger flex-fill py-2"
                    onClick={() => setModalMode("delete")}
                  >
                    <Trash2 size={16} className="me-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {modalMode === "edit" && (
              <form onSubmit={handleEditSubmit}>
                {/* Show error if any */}
                {apiError && (
                  <div className="alert alert-danger py-2 mb-3">
                    <small>{apiError}</small>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control form-control-lg"
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Stock
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={editFormData.stock}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stock: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light flex-fill py-3"
                    onClick={() => setModalMode("view")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success flex-fill py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {modalMode === "delete" && (
              <div className="text-center py-4">
                <div className="bg-danger bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <AlertTriangle size={48} className="text-danger" />
                </div>

                <h5 className="fw-bold mb-3">Delete Product</h5>
                <p className="text-secondary mb-4">
                  Are you sure you want to delete{" "}
                  <span className="fw-semibold text-dark">
                    "{selectedProduct.name}"
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light flex-fill py-3"
                    onClick={() => setModalMode("view")}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger flex-fill py-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleDeleteConfirm}
                  >
                    <Trash2 size={18} />
                    Delete Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
