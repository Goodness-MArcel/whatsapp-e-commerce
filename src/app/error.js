"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./error.css"; // Import the CSS file

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Error:", error);
    }
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-card">
        {/* Error Icon */}
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Error Code */}
        <span className="error-code">
          {error?.digest ? `ERROR_${error.digest}` : "SYSTEM_ERROR"}
        </span>

        {/* Error Title */}
        <h1>Oops! Something Went Wrong</h1>
        
        {/* Error Message */}
        <p>
          {error?.message || "An unexpected error occurred. Our team has been notified and we're working to fix it."}
        </p>

        {/* Error Details - Only in Development */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="error-details">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12H4M12 4v16" />
              </svg>
              Error Details
            </h4>
            <pre className="error-message">
              {error.stack || JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="error-actions">
          <button
            onClick={() => reset()}
            className="btn-error-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="btn-error-secondary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            Reload Page
          </button>
        </div>

        {/* Home Link */}
        <div className="home-link">
          <Link href="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
