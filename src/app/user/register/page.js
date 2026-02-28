// app/components/RegisterForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  CheckCircle,
  Loader2,
  ChevronRight,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Shield,
  Smartphone,
  Store,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import styles from "./RegisterForm.module.css";
import axios from "axios";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const response = await axios.post("/user/api/auth/register", formData);

      const data = response.data;
      console.log("Registration successful:", data);
      let user = data.user;

      sessionStorage.setItem(
        "pendingRegistration",
        JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
        }),
      );

      router.push("/user/register/shop");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <ShoppingBag size={32} className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Create your vendor account</h1>
          <p className={styles.subtitle}>
            Join 10,000+ vendors selling on WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name Field - Full Width */}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              <User size={12} className={styles.labelIcon} />
              Full Name
            </label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              />
            </div>
            {errors.name && (
              <span className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Field - Full Width */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={12} className={styles.labelIcon} />
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
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

          {/* Password Field - Left Column */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <Lock size={12} className={styles.labelIcon} />
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.password}
              </span>
            )}
            <span className={styles.hint}>
              <Info size={10} />
              Min. 8 characters
            </span>
          </div>

          {/* Confirm Password Field - Right Column */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              <Lock size={12} className={styles.labelIcon} />
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeButton}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                <AlertCircle size={12} />
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {errors.submit && (
            <div className={styles.submitError}>
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Creating account...
              </>
            ) : (
              <>
                Create account & continue
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button type="button" className={styles.googleButton}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <p className={styles.terms}>
            <CheckCircle size={12} className={styles.termsIcon} />
            By signing up, you agree to our{" "}
            <a href="/terms" className={styles.link}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className={styles.link}>
              Privacy Policy
            </a>
          </p>

          <p className={styles.loginLink}>
            Already have an account?{" "}
            <Link href="/user/login" className={styles.link}>
              Sign in <ChevronRight size={12} />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
// export default function Page() {
//   return <div>Test Page</div>;
// }
