// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";  
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn,
  AlertCircle,
  Shield,
  ArrowRight,
  Smartphone,
  Store
} from "lucide-react";
import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
     let response = await axios.post("/user/api/auth/login", formData);
      // Success - redirect to dashboard
      router.push("/user/dashboard");
      
    } catch (error) {
      setErrors({ submit: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background decorative elements */}
      <div className={styles.gradientOrb}></div>
      <div className={styles.gradientOrb2}></div>
      
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <Store size={32} className={styles.logoIcon} />
            {/* <Image
              src="/next.svg"
              alt="WhatsApp Commerce"
              width={140}
              height={28}
              priority
              className={styles.logo}
            /> */}
          </div>
          <h1 className={styles.title}>
            Welcome back
          </h1>
          <p className={styles.subtitle}>
            Sign in to your vendor dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={14} className={styles.labelIcon} />
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vendor@example.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              />
            </div>
            {errors.email && (
              <span className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <Lock size={14} className={styles.labelIcon} />
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.password}
              </span>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <Link href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {errors.submit && (
            <div className={styles.submitError}>
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>

          

          {/* Divider */}
          <div className={styles.divider}>
            <span>or</span>
          </div>

          {/* Register Link */}
          <p className={styles.registerPrompt}>
            Don't have an account?{" "}
            <Link href="/user/register" className={styles.registerLink}>
              Create your vendor account
              <ArrowRight size={14} />
            </Link>
          </p>
        </form>

        {/* Features/Benefits */}
       
        {/* Trust Badge */}
        <div className={styles.trustBadge}>
          <Shield size={14} />
          <span>256-bit SSL encrypted • Your data is safe with us</span>
        </div>
      </div>
    </div>
  );
}