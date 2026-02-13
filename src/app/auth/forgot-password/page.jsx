"use client";
import React, { useState, useEffect, useRef } from "react";
import "./forgot-password.css";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    otp: Array(6).fill(""),
    newPassword: "",
    confirmPassword: "",
  });

  const otpRefs = useRef([]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData(prev => ({ ...prev, otp: newOtp }));
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP key events
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP functionality
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      setError("");
      await axios.post("/api/auth/resend-otp", { email: formData.email });
      setCountdown(60);
      setSuccess("New OTP has been sent to your email");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/forgot-password", { email: formData.email });
      setSuccess("OTP has been sent to your email");
      setStep(2);
      setCountdown(60);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    const otpCode = formData.otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: otpCode
      });
      setSuccess("OTP verified successfully");
      setStep(3);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
        otp: formData.otp.join("")
      });
      setSuccess("Password reset successful! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Check password requirements
  const checkPasswordRequirements = () => {
    const password = formData.newPassword;
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
  };

  const requirements = checkPasswordRequirements();
  const isPasswordValid = Object.values(requirements).every(Boolean);

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Header with Icon */}
        <div className="forgot-password-header">
          <div className="forgot-password-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <h1>Reset Your Password</h1>
          <p className="forgot-password-subtitle">
            {step === 1 && "Enter your email to receive a password reset OTP"}
            {step === 2 && "Enter the 6-digit OTP sent to your email"}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="reset-steps">
          <div className={`step ${step >= 1 ? 'active' : 'inactive'}`}>
            <div className="step-number">1</div>
            <div className="step-label">Email</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : 'inactive'}`}>
            <div className="step-number">2</div>
            <div className="step-label">OTP</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : 'inactive'}`}>
            <div className="step-number">3</div>
            <div className="step-label">Password</div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`alert alert-danger ${error ? 'shake' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && step !== 3 && (
          <div className="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="forgot-password-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <small className="text-muted">
                We'll send a 6-digit OTP to this email address
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-reset"
              disabled={loading || !formData.email}
            >
              Send Reset OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="forgot-password-form">
            <div className="form-group">
              <label className="form-label">Enter 6-digit OTP</label>
              <div className="otp-input-group">
                {formData.otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpRefs.current[index] = el}
                    type="text"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength="1"
                    pattern="\d*"
                    inputMode="numeric"
                    disabled={loading}
                  />
                ))}
              </div>

              <div className="resend-otp">
                {countdown > 0 ? (
                  <span className="countdown">
                    Resend OTP in {countdown}s
                  </span>
                ) : (
                  <a onClick={handleResendOtp}>
                    Resend OTP
                  </a>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-reset"
              disabled={loading || formData.otp.join("").length !== 6}
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="newPassword"
                  placeholder="Create a strong password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.newPassword && (
                <div className="password-strength">
                  <div className="strength-text">Password Strength</div>
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className={`strength-bar ${index <= Object.values(requirements).filter(Boolean).length ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                  <ul className="password-requirements">
                    <li className={requirements.length ? "valid" : "invalid"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {requirements.length ? (
                          <polyline points="20 6 9 17 4 12" />
                        ) : (
                          <circle cx="12" cy="12" r="10" />
                        )}
                      </svg>
                      At least 8 characters
                    </li>
                    <li className={requirements.uppercase ? "valid" : "invalid"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {requirements.uppercase ? (
                          <polyline points="20 6 9 17 4 12" />
                        ) : (
                          <circle cx="12" cy="12" r="10" />
                        )}
                      </svg>
                      One uppercase letter
                    </li>
                    <li className={requirements.lowercase ? "valid" : "invalid"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {requirements.lowercase ? (
                          <polyline points="20 6 9 17 4 12" />
                        ) : (
                          <circle cx="12" cy="12" r="10" />
                        )}
                      </svg>
                      One lowercase letter
                    </li>
                    <li className={requirements.number ? "valid" : "invalid"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {requirements.number ? (
                          <polyline points="20 6 9 17 4 12" />
                        ) : (
                          <circle cx="12" cy="12" r="10" />
                        )}
                      </svg>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-reset"
              disabled={loading || !isPasswordValid || formData.newPassword !== formData.confirmPassword}
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Success State */}
        {success && step === 3 && (
          <div className="success-state">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="success-message">
              Your password has been reset successfully!<br />
              You will be redirected to the login page shortly.
            </p>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="back-to-login">
          <a href="/auth/login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}