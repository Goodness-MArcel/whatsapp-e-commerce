"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Check, AlertCircle, Loader } from "lucide-react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("error");
        setMessage("No payment reference found");
        return;
      }

      try {
        console.log("Verifying payment with reference:", reference);
        const response = await axios.get(`/api/order?reference=${reference}`);
        
        if (response.data.message === "Payment verified successfully") {
          setStatus("success");
          setMessage("Payment successful! Your order has been confirmed.");
          
          // Clear cart from localStorage
          localStorage.removeItem('cart');
          localStorage.removeItem('pendingPayment');
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(error.response?.data?.message || "Failed to verify payment");
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 rounded-4 p-4 text-center" style={{ maxWidth: "500px", width: "90%" }}>
        {status === "verifying" && (
          <>
            <div className="mb-4">
              <Loader size={64} className="text-primary animate-spin mx-auto" />
            </div>
            <h4 className="mb-3">Verifying Payment</h4>
            <p className="text-muted">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4">
              <div className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto" style={{ width: "80px", height: "80px" }}>
                <Check size={48} className="text-white" />
              </div>
            </div>
            <h4 className="mb-3 text-success">Payment Successful!</h4>
            <p className="text-muted mb-3">{message}</p>
            <p className="small text-muted">Redirecting you back to store...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4">
              <div className="rounded-circle bg-danger d-flex align-items-center justify-content-center mx-auto" style={{ width: "80px", height: "80px" }}>
                <AlertCircle size={48} className="text-white" />
              </div>
            </div>
            <h4 className="mb-3 text-danger">Payment Error</h4>
            <p className="text-muted mb-3">{message}</p>
            <button 
              className="btn btn-success mt-3"
              onClick={() => window.location.href = "/"}
            >
              Return to Store
            </button>
          </>
        )}
      </div>
    </div>
  );
}