"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { MessageCircle, X, ShoppingBag, Check, AlertCircle, Store } from "lucide-react";

export default function WhatsAppCheckout({ storeData, onClose }) {
  const { cart, getCartTotal, getCartCount, getWhatsAppMessage, clearCart } = useCart();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const handleWhatsAppCheckout = () => {
    if (!storeData?.whatsappNumber) {
      setError("Vendor WhatsApp number not available");
      return;
    }

    setIsSending(true);

    // Format phone number (remove non-digits)
    const vendorNumber = storeData.whatsappNumber.replace(/\D/g, '');
    
    // Generate message
    const message = getWhatsAppMessage(storeData.storeName);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${vendorNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Optional: Clear cart after successful redirect
    setTimeout(() => {
      clearCart();
      onClose();
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center">
        <ShoppingBag size={48} className="text-secondary mb-3 mx-auto" />
        <h5>Your cart is empty</h5>
        <p className="text-secondary small mb-3">Add some products to checkout</p>
        <button className="btn btn-success btn-sm" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="whatsapp-checkout">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <MessageCircle size={20} className="text-success" />
          <h6 className="mb-0 fw-semibold">WhatsApp Checkout</h6>
        </div>
        <button 
          className="btn btn-sm btn-light rounded-circle p-1"
          onClick={onClose}
          style={{ width: "28px", height: "28px" }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Order Summary */}
      <div className="p-3">
        <div className="bg-light rounded-3 p-3 mb-3">
          <h6 className="small fw-semibold mb-3">Order Summary</h6>
          
          {cart.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success rounded-circle" style={{ width: "20px", height: "20px" }}>
                  {item.quantity}
                </span>
                <span className="small">{item.name}</span>
              </div>
              <span className="small fw-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr className="my-2" />
          
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Total ({getCartCount()} items)</span>
            <span className="h5 text-success mb-0">${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-white rounded-3 border">
          <div className="bg-success bg-opacity-10 rounded-circle p-2">
            <Store size={18} className="text-success" />
          </div>
          <div>
            <div className="small fw-semibold">{storeData?.storeName}</div>
            <div className="small text-secondary">
              {storeData?.whatsappNumber || "No WhatsApp number"}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Message Preview */}
        <div className="bg-light rounded-3 p-3 mb-3">
          <h6 className="small fw-semibold mb-2">Message Preview:</h6>
          <div className="small text-secondary" style={{ whiteSpace: "pre-line" }}>
            {getWhatsAppMessage(storeData?.storeName)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <button
            className="btn btn-success py-2 d-flex align-items-center justify-content-center gap-2"
            onClick={handleWhatsAppCheckout}
            disabled={isSending || !storeData?.whatsappNumber}
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                Opening WhatsApp...
              </>
            ) : (
              <>
                <MessageCircle size={18} />
                Continue on WhatsApp
              </>
            )}
          </button>
          <button
            className="btn btn-outline-secondary py-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        <p className="text-center text-secondary small mt-3 mb-0">
          You'll be redirected to WhatsApp to chat with the vendor
        </p>
      </div>
    </div>
  );
}