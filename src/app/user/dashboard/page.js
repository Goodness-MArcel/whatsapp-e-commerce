// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import RecentProducts from '../../components/RecentProducts';
// import {
//   Pencil,
//   PlusCircle,
//   MessageCircle,
//   Package,
//   ShoppingBag,
//   Calendar,
//   User,
//   Box,
//   Truck,
//   HelpCircle,
//   Store,
//   X,
//   Upload
// } from "lucide-react";

// export default function VendorDashboard() {
//   const [showAddProductModal, setShowAddProductModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     image: null
//   });
//   const [imagePreview, setImagePreview] = useState(null);

//   // Simple store data
//   const store = {
//     name: "My Store",
//     products: 12,
//     orders: 8,
//     todayOrders: 3,
//     whatsapp: "+1234567890",
//     image: "/api/placeholder/64/64"
//   };

//   // Recent orders
//   const recentOrders = [
//     { customer: "Sarah", items: "2 items", total: "$45", time: "10 min ago" },
//     { customer: "Mike", items: "1 item", total: "$25", time: "1 hour ago" },
//     { customer: "Anna", items: "3 items", total: "$67", time: "3 hours ago" },
//   ];

//   // Sample recent products data
//   const recentProducts = [
//     {
//       id: 1,
//       name: "Wireless Headphones",
//       price: "79.99",
//       addedTime: "2 hours ago",
//       image: "/api/placeholder/50/50"
//     },
//     {
//       id: 2,
//       name: "Cotton T-Shirt",
//       price: "24.99",
//       addedTime: "Yesterday",
//       image: null
//     },
//     {
//       id: 3,
//       name: "Coffee Mug",
//       price: "12.99",
//       addedTime: "2 days ago",
//       image: "/api/placeholder/50/50"
//     },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         image: file
//       }));

//       // Create preview URL
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Here you would typically send the data to your API
//     const productData = {
//       name: formData.name,
//       price: parseFloat(formData.price),
//       description: formData.description,
//       storeId: "your-store-id", // Get this from your store context/session
//       // Handle image upload separately
//     };

//     console.log("Submitting product:", productData);

//     // TODO: Send to your API endpoint
//     // const response = await fetch('/api/products', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(productData)
//     // });

//     // Reset form and close modal
//     setFormData({ name: '', price: '', description: '', image: null });
//     setImagePreview(null);
//     setShowAddProductModal(false);

//     // Refresh products list (you'd typically refetch here)
//   };

//   return (
//     <div className="container py-3">
//       {/* Header with Store Image */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex align-items-center gap-3">
//           {/* Store Image */}
//           <div className="bg-light rounded-3 d-flex align-items-center justify-content-center"
//                style={{ width: "48px", height: "48px", overflow: "hidden" }}>
//             {store.image ? (
//               <img
//                 src={store.image}
//                 alt={store.name}
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <Store size={24} className="text-secondary" />
//             )}
//           </div>

//           <div>
//             <h5 className="fw-bold mb-1">{store.name}</h5>
//             <div className="d-flex align-items-center gap-2">
//               <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill" style={{ fontSize: "0.7rem" }}>
//                 Active
//               </span>
//               <small className="text-secondary d-flex align-items-center gap-1">
//                 <MessageCircle size={14} className="text-success" />
//                 {store.whatsapp}
//               </small>
//             </div>
//           </div>
//         </div>

//         <Link href="/store/edit" className="btn btn-sm btn-outline-secondary rounded-circle p-2">
//           <Pencil size={16} />
//         </Link>
//       </div>

//       {/* Stats Row */}
//       <div className="row g-2 mb-4">
//         <div className="col-4">
//           <div className="bg-light rounded-3 p-3 text-center">
//             <Package size={20} className="text-success mx-auto mb-1" />
//             <h4 className="fw-bold mb-0">{store.products}</h4>
//             <small className="text-secondary">Products</small>
//           </div>
//         </div>
//         <div className="col-4">
//           <div className="bg-light rounded-3 p-3 text-center">
//             <ShoppingBag size={20} className="text-success mx-auto mb-1" />
//             <h4 className="fw-bold mb-0">{store.orders}</h4>
//             <small className="text-secondary">Orders</small>
//           </div>
//         </div>
//         <div className="col-4">
//           <div className="bg-light rounded-3 p-3 text-center">
//             <Calendar size={20} className="text-success mx-auto mb-1" />
//             <h4 className="fw-bold mb-0">{store.todayOrders}</h4>
//             <small className="text-secondary">Today</small>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="d-flex gap-2 mb-4">
//         <button
//           onClick={() => setShowAddProductModal(true)}
//           className="btn btn-success flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
//         >
//           <PlusCircle size={18} />
//           Add Product
//         </button>
//         <Link
//           href={`https://wa.me/${store.whatsapp}`}
//           target="_blank"
//           className="btn btn-outline-success flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
//         >
//           <MessageCircle size={18} />
//           WhatsApp
//         </Link>
//       </div>

//       {/* Recent Products Component */}
//       <RecentProducts products={recentProducts} />

//       {/* Recent Orders */}
//       <div className="mb-4">
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <h6 className="fw-semibold mb-0">Recent Orders</h6>
//           {store.orders > 0 && (
//             <Link href="/orders" className="text-success text-decoration-none small">
//               View all
//             </Link>
//           )}
//         </div>

//         {recentOrders.length > 0 ? (
//           <div className="list-group">
//             {recentOrders.map((order, i) => (
//               <Link
//                 key={i}
//                 href={`/orders/${i}`}
//                 className="list-group-item list-group-item-action px-3 py-2 text-decoration-none"
//               >
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div className="d-flex align-items-center gap-2">
//                     <div className="bg-light rounded-circle p-2">
//                       <User size={16} className="text-success" />
//                     </div>
//                     <div>
//                       <div className="fw-medium text-dark">{order.customer}</div>
//                       <small className="text-secondary">
//                         {order.items} • {order.time}
//                       </small>
//                     </div>
//                   </div>
//                   <div className="fw-bold text-dark">{order.total}</div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-5 bg-light rounded-3">
//             <Box size={32} className="text-secondary mx-auto mb-2" />
//             <p className="text-secondary mb-1">No orders yet</p>
//             <small className="text-secondary">Share your WhatsApp to start selling</small>
//           </div>
//         )}
//       </div>

//       {/* Quick Links */}
//       <div className="bg-light rounded-3 p-3">
//         <div className="d-flex gap-4">
//           <Link href="/products" className="text-success text-decoration-none small d-flex align-items-center gap-1">
//             <Package size={14} />
//             Products
//           </Link>
//           <Link href="/orders" className="text-success text-decoration-none small d-flex align-items-center gap-1">
//             <Truck size={14} />
//             Orders
//           </Link>
//           <Link href="/how-it-works" className="text-success text-decoration-none small d-flex align-items-center gap-1">
//             <HelpCircle size={14} />
//             Help
//           </Link>
//         </div>
//       </div>

//       {/* Add Product Modal */}
//       {showAddProductModal && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//           style={{
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 1050,
//             backdropFilter: 'blur(4px)'
//           }}
//         >
//           <div className="bg-white rounded-4 p-4" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
//             {/* Modal Header */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="fw-bold mb-0">Add New Product</h5>
//               <button
//                 onClick={() => {
//                   setShowAddProductModal(false);
//                   setFormData({ name: '', price: '', description: '', image: null });
//                   setImagePreview(null);
//                 }}
//                 className="btn btn-light rounded-circle p-2"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Product Form */}
//             <form onSubmit={handleSubmit}>
//               {/* Image Upload */}
//               <div className="mb-4">
//                 <label className="form-label small fw-semibold text-secondary mb-2">
//                   Product Image
//                 </label>
//                 <div
//                   className="border rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
//                   style={{
//                     minHeight: '160px',
//                     backgroundColor: '#f8f9fa',
//                     cursor: 'pointer'
//                   }}
//                   onClick={() => document.getElementById('product-image').click()}
//                 >
//                   {imagePreview ? (
//                     <div className="position-relative">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         style={{
//                           maxWidth: '100%',
//                           maxHeight: '150px',
//                           objectFit: 'contain'
//                         }}
//                       />
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setImagePreview(null);
//                           setFormData(prev => ({ ...prev, image: null }));
//                         }}
//                       >
//                         <X size={12} />
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload size={32} className="text-secondary mb-2" />
//                       <span className="small text-secondary">Click to upload image</span>
//                       <span className="small text-secondary mt-1">PNG, JPG up to 5MB</span>
//                     </>
//                   )}
//                   <input
//                     id="product-image"
//                     type="file"
//                     accept="image/*"
//                     className="d-none"
//                     onChange={handleImageChange}
//                   />
//                 </div>
//               </div>

//               {/* Product Name */}
//               <div className="mb-3">
//                 <label className="form-label small fw-semibold text-secondary">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="form-control form-control-lg"
//                   placeholder="e.g., Wireless Headphones"
//                   required
//                 />
//               </div>

//               {/* Price */}
//               <div className="mb-3">
//                 <label className="form-label small fw-semibold text-secondary">
//                   Price *
//                 </label>
//                 <div className="input-group">
//                   <span className="input-group-text bg-light">$</span>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     className="form-control form-control-lg"
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="mb-4">
//                 <label className="form-label small fw-semibold text-secondary">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   rows="4"
//                   placeholder="Describe your product..."
//                 />
//               </div>

//               {/* Form Actions */}
//               <div className="d-flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddProductModal(false);
//                     setFormData({ name: '', price: '', description: '', image: null });
//                     setImagePreview(null);
//                   }}
//                   className="btn btn-light flex-fill py-3"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-success flex-fill py-3"
//                 >
//                   Add Product
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";
import RecentProducts from "../../components/RecentProducts";
import {
  Pencil,
  PlusCircle,
  MessageCircle,
  Package,
  ShoppingBag,
  Calendar,
  User,
  Box,
  Truck,
  HelpCircle,
  Store,
  X,
  Upload,
  ChevronLeft,
} from "lucide-react";

export default function VendorDashboard() {
  const { userInfo } = useUser();
 let products = userInfo?.store?.products;
 console.log(products)
  const storeId = userInfo?.store?.id || "default-store-id";
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Simple store data
  const store = {
    name: "My Store",
    products: 12,
    orders: 8,
    todayOrders: 3,
    whatsapp: "+1234567890",
    image: "/api/placeholder/64/64",
  };

  // Recent orders
  const recentOrders = [
    { customer: "Sarah", items: "2 items", total: "$45", time: "10 min ago" },
    { customer: "Mike", items: "1 item", total: "$25", time: "1 hour ago" },
    { customer: "Anna", items: "3 items", total: "$67", time: "3 hours ago" },
  ];

  

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const productData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          productData.append(key, formData[key]);
        }
      });
      productData.append("storeId", storeId);

      const response = await fetch("/user/api/auth/products", {
        method: "POST",
        body: productData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert(data.message || "Product added successfully");

      // Reset form and close tab
      setFormData({ name: "", price: "", description: "", image: null });
      setImagePreview(null);
      setShowAddProduct(false);
    } catch (error) {
      alert("Failed to add product: " + error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3 position-relative">
      {/* Header with Store Image */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-light rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: "48px", height: "48px", overflow: "hidden" }}
          >
            {store.image ? (
              <img
                src={userInfo?.store?.logo}
                alt={userInfo?.store?.storeName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Store size={24} className="text-secondary" />
            )}
          </div>

          <div>
            <h5 className="fw-bold mb-1">{userInfo?.store?.storeName}</h5>
            <div className="d-flex align-items-center gap-2">
              <span
                className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill"
                style={{ fontSize: "0.7rem" }}
              >
                Active
              </span>
              <small className="text-secondary d-flex align-items-center gap-1">
                <MessageCircle size={14} className="text-success" />
                {userInfo?.store?.whatsappNumber || "No WhatsApp"}
              </small>
            </div>
          </div>
        </div>

        <Link
          href="/store/edit"
          className="btn btn-sm btn-outline-secondary rounded-circle p-2"
        >
          <Pencil size={16} />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="row g-2 mb-4">
        <div className="col-4">
          <div className="bg-light rounded-3 p-3 text-center">
            <Package size={20} className="text-success mx-auto mb-1" />
            <h4 className="fw-bold mb-0">{products.length}</h4>
            <small className="text-secondary">Products</small>
          </div>
        </div>
        <div className="col-4">
          <div className="bg-light rounded-3 p-3 text-center">
            <ShoppingBag size={20} className="text-success mx-auto mb-1" />
            <h4 className="fw-bold mb-0">{store.orders}</h4>
            <small className="text-secondary">Orders</small>
          </div>
        </div>
        <div className="col-4">
          <div className="bg-light rounded-3 p-3 text-center">
            <Calendar size={20} className="text-success mx-auto mb-1" />
            <h4 className="fw-bold mb-0">{store.todayOrders}</h4>
            <small className="text-secondary">Today</small>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 mb-4">
        <button
          onClick={() => setShowAddProduct(true)}
          className="btn btn-success flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
        >
          <PlusCircle size={18} />
          Add Product
        </button>
        <Link
          href={`https://wa.me/${store.whatsapp}`}
          target="_blank"
          className="btn btn-outline-success flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
        >
          <MessageCircle size={18} />
          WhatsApp
        </Link>
      </div>

      {/* Main Content - Conditionally show based on tab state */}
      {!showAddProduct ? (
        <>
          {/* Recent Products Component */}
          <RecentProducts products={products} />

          {/* Recent Orders */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Recent Orders</h6>
              {store.orders > 0 && (
                <Link
                  href="/orders"
                  className="text-success text-decoration-none small"
                >
                  View all
                </Link>
              )}
            </div>

            {recentOrders.length > 0 ? (
              <div className="list-group">
                {recentOrders.map((order, i) => (
                  <Link
                    key={i}
                    href={`/orders/${i}`}
                    className="list-group-item list-group-item-action px-3 py-2 text-decoration-none"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle p-2">
                          <User size={16} className="text-success" />
                        </div>
                        <div>
                          <div className="fw-medium text-dark">
                            {order.customer}
                          </div>
                          <small className="text-secondary">
                            {order.items} • {order.time}
                          </small>
                        </div>
                      </div>
                      <div className="fw-bold text-dark">{order.total}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-light rounded-3">
                <Box size={32} className="text-secondary mx-auto mb-2" />
                <p className="text-secondary mb-1">No orders yet</p>
                <small className="text-secondary">
                  Share your WhatsApp to start selling
                </small>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-light rounded-3 p-3">
            <div className="d-flex gap-4">
              <Link
                href="/products"
                className="text-success text-decoration-none small d-flex align-items-center gap-1"
              >
                <Package size={14} />
                Products
              </Link>
              <Link
                href="/orders"
                className="text-success text-decoration-none small d-flex align-items-center gap-1"
              >
                <Truck size={14} />
                Orders
              </Link>
              <Link
                href="/how-it-works"
                className="text-success text-decoration-none small d-flex align-items-center gap-1"
              >
                <HelpCircle size={14} />
                Help
              </Link>
            </div>
          </div>
        </>
      ) : (
        /* Add Product Tab */
        <div className="position-relative">
          {/* Tab Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              onClick={() => {
                setShowAddProduct(false);
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  image: null,
                });
                setImagePreview(null);
              }}
              className="btn btn-light rounded-circle p-2"
            >
              <ChevronLeft size={20} />
            </button>
            <h5 className="fw-bold mb-0">Add New Product</h5>
          </div>

          {/* Product Form */}
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary mb-2">
                Product Image
              </label>
              <div
                className="border rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
                style={{
                  minHeight: "180px",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("product-image").click()}
              >
                {imagePreview ? (
                  <div className="position-relative w-100 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        objectFit: "contain",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: null }));
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={36} className="text-secondary mb-2" />
                    <span className="small text-secondary">
                      Tap to upload image
                    </span>
                    <span className="small text-secondary mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </>
                )}
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Product Name */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control form-control-lg"
                placeholder="e.g., Wireless Headphones"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Price *
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-control form-control-lg"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
                rows="4"
                placeholder="Describe your product..."
              />
            </div>

            {/* Form Actions */}
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddProduct(false);
                  setFormData({
                    name: "",
                    price: "",
                    description: "",
                    image: null,
                  });
                  setImagePreview(null);
                }}
                className="btn btn-light flex-fill py-3"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success flex-fill py-3">
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Adding..
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
