"use client";

import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  X,
  ShoppingBag,
  Check,
  AlertCircle,
  Store,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function WhatsAppCheckout({ storeData, onClose }) {
  const { cart, getCartTotal, getCartCount, getWhatsAppMessage, clearCart } =
    useCart();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [checkoutMethod, setCheckoutMethod] = useState("whatsapp"); // 'whatsapp' or 'web'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // User info form state
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppCheckout = () => {
    if (!storeData?.whatsappNumber) {
      setError("Vendor WhatsApp number not available");
      return;
    }

    setIsSending(true);

    // Format phone number (remove non-digits)
    const vendorNumber = storeData.whatsappNumber.replace(/\D/g, "");

    if (!vendorNumber) {
      alert("Vendor number not available");
      return;
    }

    let fullNumber = vendorNumber;
    const country_code = "234";

    // Remove leading zero if present (common in Nigerian numbers)
    const numberWithoutLeadingZero = vendorNumber.startsWith("0")
      ? vendorNumber.substring(1)
      : vendorNumber;

    // Check if number already has country code
    if (!numberWithoutLeadingZero.startsWith("234")) {
      fullNumber = country_code + numberWithoutLeadingZero;
    } else {
      fullNumber = numberWithoutLeadingZero;
    }

    // Add + prefix
    fullNumber = "+" + fullNumber;

    // Generate message with cart items
    const message = getWhatsAppMessage(storeData.storeName);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Optional: Clear cart after successful redirect
    setTimeout(() => {
      clearCart();
      onClose();
      setIsSending(false);
    }, 1000);
  };

  const handleWebCheckout = async (e) => {
  e.preventDefault();
  
  // Validate form
  if (!userInfo.fullName || !userInfo.email || !userInfo.phone || !userInfo.address) {
    setError("Please fill in all required fields");
    return;
  }

  setIsProcessing(true);
  setError("");

  try {
    const orderData = {
      user: userInfo,
      store: storeData,
      items: cart,
      total: getCartTotal(),
      orderDate: new Date().toISOString(),
    };

    console.log("Sending order data:", orderData);

    const response = await axios.post("/api/order", orderData);
    
    console.log("Order response:", response.data);
    
    // Store the payment URL and reference
    const { paymentUrl, reference } = response.data;
    
    if (!paymentUrl) {
      throw new Error("No payment URL received from server");
    }
    
    console.log("Redirecting to payment URL:", paymentUrl);
    console.log("Order reference:", reference);
    
    // Store reference in localStorage for backup
    localStorage.setItem('pendingPayment', reference);
    
    // Redirect to Paystack payment page
    window.location.href = paymentUrl;
    
  } catch (err) {
    console.error("Checkout error:", err);
    console.error("Error response:", err.response?.data);
    setError(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
    setIsProcessing(false);
  }
};

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center">
        <ShoppingBag size={48} className="text-success mb-3 mx-auto" />
        <h5 className="text-dark">Your cart is empty</h5>
        <p className="text-secondary small mb-3">
          Add some products to checkout
        </p>
        <button 
          className="btn" 
          onClick={onClose}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: "500"
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="p-4 text-center">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#28a745",
            color: "white"
          }}
        >
          <Check size={32} />
        </div>
        <h5 className="text-dark mb-2">Order Placed Successfully!</h5>
        <p className="text-secondary small mb-3">
          Thank you for your order. We'll contact you soon.
        </p>
        <p className="text-secondary small">
          Redirecting you back to store...
        </p>
      </div>
    );
  }

  return (
    <div className="whatsapp-checkout">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          {checkoutMethod === "whatsapp" ? (
            <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#28a745", fontSize: "20px" }} />
          ) : (
            <CreditCard size={20} style={{ color: "#28a745" }} />
          )}
          <h6 className="mb-0 fw-semibold text-dark">
            {checkoutMethod === "whatsapp" ? "WhatsApp Checkout" : "Web Checkout"}
          </h6>
        </div>
        <button
          className="btn btn-sm btn-light rounded-circle p-1"
          onClick={onClose}
          style={{ width: "28px", height: "28px" }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Checkout Method Toggle */}
      <div className="p-3 border-bottom">
        <div className="d-flex gap-2">
          <button
            className={`flex-fill py-2 px-3 rounded-3 border d-flex align-items-center justify-content-center gap-2 ${
              checkoutMethod === "whatsapp" ? "active" : ""
            }`}
            onClick={() => setCheckoutMethod("whatsapp")}
            style={{
              backgroundColor: checkoutMethod === "whatsapp" ? "#28a745" : "white",
              color: checkoutMethod === "whatsapp" ? "white" : "#666",
              border: checkoutMethod === "whatsapp" ? "none" : "1px solid #dee2e6",
              transition: "all 0.2s"
            }}
          >
            <FontAwesomeIcon icon={faWhatsapp} size="sm" />
            <span className="small fw-medium">WhatsApp</span>
          </button>
          <button
            className={`flex-fill py-2 px-3 rounded-3 border d-flex align-items-center justify-content-center gap-2 ${
              checkoutMethod === "web" ? "active" : ""
            }`}
            onClick={() => setCheckoutMethod("web")}
            style={{
              backgroundColor: checkoutMethod === "web" ? "#28a745" : "white",
              color: checkoutMethod === "web" ? "white" : "#666",
              border: checkoutMethod === "web" ? "none" : "1px solid #dee2e6",
              transition: "all 0.2s"
            }}
          >
            <CreditCard size={16} />
            <span className="small fw-medium">Web Checkout</span>
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Order Summary */}
        <div 
          className="rounded-3 p-3 mb-3"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h6 className="small fw-semibold mb-3 text-dark">Order Summary</h6>

          {cart.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    width: "20px",
                    height: "20px",
                    fontSize: "11px"
                  }}
                >
                  {item.quantity}
                </span>
                <span className="small text-dark">{item.name}</span>
              </div>
              <span className="small fw-semibold text-dark">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr className="my-2" style={{ opacity: 0.1 }} />

          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold text-dark">Total ({getCartCount()} items)</span>
            <span className="h5 mb-0" style={{ color: "#28a745" }}>
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-white rounded-3 border">
          <div 
            className="rounded-circle p-2"
            style={{ backgroundColor: "rgba(40, 167, 69, 0.1)" }}
          >
            <Store size={18} style={{ color: "#28a745" }} />
          </div>
          <div>
            <div className="small fw-semibold text-dark">{storeData?.storeName}</div>
            <div className="small text-secondary">
              {storeData?.whatsappNumber || "No WhatsApp number"}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="alert py-2 small d-flex align-items-center gap-2 mb-3"
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              border: "none",
              borderRadius: "8px"
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Checkout Content */}
        {checkoutMethod === "whatsapp" ? (
          <>
            {/* Message Preview */}
            <div 
              className="rounded-3 p-3 mb-3"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <h6 className="small fw-semibold mb-2 text-dark">Message Preview:</h6>
              <div
                className="small text-secondary"
                style={{ whiteSpace: "pre-line" }}
              >
                {getWhatsAppMessage(storeData?.storeName)}
              </div>
            </div>

            {/* WhatsApp Action Buttons */}
            <div className="d-grid gap-2">
              <button
                className="btn py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleWhatsAppCheckout}
                disabled={isSending || !storeData?.whatsappNumber}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500"
                }}
              >
                {isSending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                    Opening WhatsApp...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faWhatsapp} />
                    Continue on WhatsApp
                  </>
                )}
              </button>
              <button 
                className="btn py-1" 
                onClick={onClose}
                style={{
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px"
                }}
              >
                Cancel
              </button>
            </div>

            <p className="text-center text-secondary small mt-3 mb-0">
              You'll be redirected to WhatsApp to chat with the vendor
            </p>
          </>
        ) : (
          <>
            {/* Web Checkout Form */}
            <form onSubmit={handleWebCheckout}>
              <div className="mb-3">
                <label className="small fw-semibold mb-2 text-dark d-flex align-items-center gap-1">
                  <User size={14} style={{ color: "#28a745" }} />
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                  placeholder="Enter your full name"
                  required
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    padding: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="small fw-semibold mb-2 text-dark d-flex align-items-center gap-1">
                  <Mail size={14} style={{ color: "#28a745" }} />
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                  placeholder="Enter your email"
                  required
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    padding: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="small fw-semibold mb-2 text-dark d-flex align-items-center gap-1">
                  <Phone size={14} style={{ color: "#28a745" }} />
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                  placeholder="Enter your phone number"
                  required
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    padding: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="small fw-semibold mb-2 text-dark d-flex align-items-center gap-1">
                  <MapPin size={14} style={{ color: "#28a745" }} />
                  Delivery Address <span className="text-danger">*</span>
                </label>
                <textarea
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                  placeholder="Enter your full delivery address"
                  rows="2"
                  required
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="small fw-semibold mb-2 text-dark">City</label>
                <input
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                  placeholder="Enter your city"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    padding: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="small fw-semibold mb-2 text-dark">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={userInfo.notes}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                  placeholder="Any special instructions for delivery?"
                  rows="2"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Web Checkout Action Buttons */}
              <div className="d-grid gap-2 mt-4">
                <button
                  type="submit"
                  className="btn py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={isProcessing}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "500"
                  }}
                >
                  {isProcessing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Place Order (${getCartTotal().toFixed(2)})
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  className="btn py-1" 
                  onClick={onClose}
                  style={{
                    backgroundColor: "transparent",
                    color: "#666",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="text-center text-secondary small mt-3 mb-0">
              We'll process your order and contact you for confirmation
            </p>
          </>
        )}
      </div>
    </div>
  );
}