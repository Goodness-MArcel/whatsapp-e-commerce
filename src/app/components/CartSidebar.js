"use client";
import React, {useState} from "react";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import WhatsAppCheckout from "./WhatsAppCheckout";

export default function CompactCart({ show, onClose, storeData }) {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    getCartCount 
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  if (!show) return null;

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ 
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1040,
          backdropFilter: "blur(2px)"
        }}
        onClick={onClose}
      />

      {/* Compact Cart */}
      <div 
        className="position-fixed top-0 end-0 bg-white shadow-lg"
        style={{ 
          width: "360px",
          height: "100vh",
          zIndex: 1050,
          transform: show ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.2s ease-out",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <ShoppingBag size={20} className="text-success" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success text-white" 
                    style={{ fontSize: "10px", minWidth: "16px", height: "16px", lineHeight: "16px", padding: 0 }}>
                {getCartCount()}
              </span>
            </div>
            <h6 className="mb-0 fw-semibold">Shopping Cart</h6>
          </div>
          <button 
            className="btn btn-sm btn-light rounded-circle p-1"
            onClick={onClose}
            style={{ width: "28px", height: "28px" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: "#f8f9fa" }}>
          {cart.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4">
              <div className="bg-light rounded-circle p-3 mb-3">
                <ShoppingBag size={32} className="text-secondary opacity-50" />
              </div>
              <p className="text-secondary small mb-3">Your cart is empty</p>
              <button 
                className="btn btn-success btn-sm px-4"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-2">
              {cart.map((item) => (
                <div key={item.id} className="card border-0 shadow-sm mb-2">
                  <div className="card-body p-2">
                    <div className="d-flex gap-2">
                      {/* Product Image */}
                      <div className="bg-light rounded" style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-fit-contain p-1"
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <ShoppingBag size={20} className="text-secondary opacity-50" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="small fw-semibold mb-1 text-truncate" style={{ maxWidth: "160px" }}>
                            {item.name}
                          </h6>
                          <button 
                            className="btn btn-link text-danger p-0"
                            onClick={() => removeFromCart(item.id)}
                            style={{ lineHeight: 1 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span className="text-success fw-semibold small">
                            ${item.price.toFixed(2)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="d-flex align-items-center border rounded" style={{ height: "24px" }}>
                            <button 
                              className="btn btn-link p-0 px-1 text-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ lineHeight: 1 }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-1 small" style={{ minWidth: "20px", textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <button 
                              className="btn btn-link p-0 px-1 text-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ lineHeight: 1 }}
                            >
                              <Plus size={12} />
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
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-3 border-top bg-white">
            {/* Subtotal */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-secondary small">Subtotal</span>
              <span className="fw-bold text-success">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <button 
                className="btn btn-success py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleCheckout}
              >
                <MessageCircle size={18} />
                Checkout via WhatsApp
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm py-1"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Checkout Modal */}
      {showCheckout && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-center"
          style={{ zIndex: 1060 }}
        >
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={() => setShowCheckout(false)}
          />
          <div 
            className="bg-white rounded-3 shadow-lg position-relative"
            style={{ width: "400px", maxWidth: "90%", maxHeight: "90vh", overflow: "auto" }}
          >
            <WhatsAppCheckout 
              storeData={storeData} 
              onClose={() => {
                setShowCheckout(false);
                onClose();
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
}