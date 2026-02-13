// app/register/shop/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { 
  Store,
  MapPin,
  Phone,
  Globe,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Edit,
  Upload,
  Loader2,
  Sparkles,
  Building,
  Briefcase,
  MessageCircle,
  Smartphone,
  Map,
  Mail,
  User,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import styles from "./ShopRegistration.module.css";

export default function StoreRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeCategory: "",
    whatsappNumber: "",
    country: "",
    city: "",
    address: "",
    description: "",
    logo: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("pendingRegistration"));
// console.log(pending.userId, pending.email);
console.log("Pending registration data:", user);

 let userId = user ? user.userId : null;
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingRegistration");
    if (!pending) {
      router.push("/user/register");
      return;
    }
    setUserData(JSON.parse(pending));
  }, [router]);

  const categories = [
    "Fashion & Apparel",
    "Electronics & Gadgets",
    "Food & Beverages",
    "Home & Living",
    "Beauty & Cosmetics",
    "Health & Wellness",
    "Jewelry & Accessories",
    "Books & Stationery",
    "Sports & Outdoors",
    "Toys & Games",
    "Automotive",
    "Other"
  ];

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia",
    "India", "Singapore", "Malaysia", "UAE",
    "South Africa", "Brazil", "Mexico", "Germany",
    "France", "Italy", "Spain", "Netherlands"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
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
      setStoreData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSubmitStore = async () => {
    if (!storeData.storeName || !storeData.storeCategory || !storeData.whatsappNumber) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(storeData).forEach(key => {
        if (storeData[key]) {
          formData.append(key, storeData[key]);
        }
      });
      formData.append("userId", userId);

      const response = await fetch("/user/api/auth/store", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Store registration failed");
      }

      sessionStorage.removeItem("pendingRegistration");
      localStorage.setItem("token", data.token);
      localStorage.setItem("storeId", data.storeId || data.shopId || "");
      
      router.push("/user/login");
      
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className={styles.loading}>
        <Loader2 size={48} className={styles.spinner} />
        <p>Loading your account...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
            <div className={styles.stepNumber}>
              <User size={16} />
            </div>
            <span>Account</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
            <div className={styles.stepNumber}>
              <Store size={16} />
            </div>
            <span>Shop Details</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ""}`}>
            <div className={styles.stepNumber}>
              <MessageCircle size={16} />
            </div>
            <span>WhatsApp</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step >= 4 ? styles.active : ""}`}>
            <div className={styles.stepNumber}>
              <CheckCircle size={16} />
            </div>
            <span>Complete</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        {/* Step 1: Welcome & Account Confirmation */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} color="#10b981" />
            </div>
            <h2 className={styles.title}>
              Account created successfully!
              <Sparkles size={24} color="#667eea" />
            </h2>
            <p className={styles.subtitle}>
              Welcome, <strong>{userData.name}</strong>! Let's set up your shop.
            </p>
            
            <div className={styles.accountInfo}>
              <div className={styles.infoItem}>
                <Mail size={16} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{userData.email}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className={styles.primaryButton}
            >
              Continue to shop setup
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Shop Basic Information */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.title}>
              Tell us about your shop
              <Store size={24} color="#667eea" />
            </h2>
            <p className={styles.subtitle}>
              This information will be visible to your customers
            </p>

            <div className={styles.form}>
              {/* Shop Logo Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Camera size={14} />
                  Shop Logo
                </label>
                <div className={styles.logoUpload}>
                  {storeData.logo ? (
                    <div className={styles.logoPreview}>
                      <img
                        src={URL.createObjectURL(storeData.logo)}
                        alt="Shop logo"
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => setStoreData(prev => ({ ...prev, logo: null }))}
                        className={styles.removeLogo}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadArea}>
                      <input
                        type="file"
                        id="logo"
                        name='logo'
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className={styles.fileInput}
                      />
                      <label htmlFor="logo" className={styles.uploadLabel}>
                        <Upload size={32} className={styles.uploadIcon} />
                        <span>Upload your logo</span>
                        <span className={styles.uploadHint}>PNG, JPG up to 2MB</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Shop Name */}
              <div className={styles.formGroup}>
                <label htmlFor="shopName" className={styles.label}>
                  <Building size={14} />
                  Shop Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={storeData.storeName}
                  onChange={handleInputChange}
                  placeholder="e.g., Priya's Fashion Boutique"
                  className={styles.input}
                />
              </div>

              {/* Category */}
              <div className={styles.formGroup}>
                <label htmlFor="shopCategory" className={styles.label}>
                  <Briefcase size={14} />
                  Category <span className={styles.required}>*</span>
                </label>
                <select
                  id="storeCategory"
                  name="storeCategory"
                  value={storeData.storeCategory}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Shop Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={storeData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you sell and what makes your shop special..."
                  rows={4}
                  className={styles.textarea}
                />
                <span className={styles.hint}>
                  <AlertCircle size={10} />
                  Max 500 characters • {storeData.description.length}/500
                </span>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={() => setStep(1)}
                  className={styles.secondaryButton}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className={styles.primaryButton}
                  disabled={!storeData.storeName || !storeData.storeCategory}
                >
                  Continue to WhatsApp setup
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: WhatsApp & Location */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.title}>
              Connect your WhatsApp
              <MessageCircle size={24} color="#25D366" />
            </h2>
            <p className={styles.subtitle}>
              This is where your customers will reach you
            </p>

            <div className={styles.form}>
              {/* WhatsApp Number */}
              <div className={styles.formGroup}>
                <label htmlFor="whatsappNumber" className={styles.label}>
                  <Smartphone size={14} />
                  WhatsApp Business Number <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWithPrefix}>
                  <span className={styles.prefix}>+</span>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={storeData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className={styles.input}
                  />
                </div>
                <span className={styles.hint}>
                  <AlertCircle size={10} />
                  Include country code (e.g., 1 for US, 91 for India)
                </span>
              </div>

              {/* Location */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label htmlFor="country" className={styles.label}>
                    <Globe size={14} />
                    Country <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={storeData.country}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Select country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.label}>
                    <MapPin size={14} />
                    City <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={storeData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                  <Map size={14} />
                  Full Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={storeData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, building, etc."
                  className={styles.input}
                />
              </div>

              <div className={styles.whatsappPreview}>
                <div className={styles.previewHeader}>
                  <MessageCircle size={20} />
                  <span>WhatsApp Preview</span>
                </div>
                <div className={styles.previewContent}>
                  <div className={styles.previewMessage}>
                    <strong>Customer:</strong> Do you have this in stock?
                  </div>
                  <div className={styles.previewMessageVendor}>
                    <strong>You:</strong> Yes, it's available! 
                      {storeData.storeName && ` Welcome to ${storeData.storeName}!`}
                  </div>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={() => setStep(2)}
                  className={styles.secondaryButton}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className={styles.primaryButton}
                  disabled={!storeData.whatsappNumber || !storeData.country || !storeData.city}
                >
                  Review & Complete
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Complete */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h2 className={styles.title}>
              Review your shop
              <CheckCircle size={24} color="#10b981" />
            </h2>
            <p className={styles.subtitle}>
              Please verify all information before completing registration
            </p>

            <div className={styles.reviewCard}>
              <div className={styles.reviewSection}>
                <h3>
                  <Store size={16} />
                  Shop Information
                </h3>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Shop Name:</span>
                    <span className={styles.reviewValue}>{storeData.storeName}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Category:</span>
                      <span className={styles.reviewValue}>{storeData.storeCategory}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Description:</span>
                    <span className={styles.reviewValue}>{storeData.description || "—"}</span>
                  </div>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h3>
                  <MessageCircle size={16} />
                  Contact Information
                </h3>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>WhatsApp:</span>
                    <span className={styles.reviewValue}>+{storeData.whatsappNumber}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Location:</span>
                    <span className={styles.reviewValue}>
                      {storeData.city}, {storeData.country}
                    </span>
                  </div>
                  {storeData.address && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Address:</span>
                      <span className={styles.reviewValue}>{storeData.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.reviewActions}>
                <button
                  onClick={() => setStep(2)}
                  className={styles.editButton}
                >
                  <Edit size={14} />
                  Edit Shop Details
                </button>
                <button
                  onClick={() => setStep(3)}
                  className={styles.editButton}
                >
                  <Edit size={14} />
                  Edit WhatsApp Settings
                </button>
              </div>
            </div>

            <div className={styles.termsCheckbox}>
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                <Shield size={14} />
                I agree to the <a href="/terms">Vendor Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={() => setStep(3)}
                className={styles.secondaryButton}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleSubmitStore}
                disabled={isLoading}
                className={styles.primaryButton}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Creating your shop...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}