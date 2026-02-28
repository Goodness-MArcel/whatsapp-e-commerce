"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  ChevronDown,
  LogIn,
  UserPlus,
  ShoppingBag,
  Store,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import Footer from "./footer";
import styles from "./NavbarFooterWrapper.module.css";

export default function NavbarFooterWrapper({ children }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Fixed: Store pages should show footer but hide navbar
  const isStorePage = pathname?.startsWith("/store/");
  const hideNavbar = pathname?.startsWith("/admin") || 
                     pathname?.startsWith("/dashboard") || 
                     pathname?.startsWith("/auth/login") || 
                     pathname?.startsWith("/auth/register") ||
                     pathname?.startsWith("/user") ||
                     pathname?.startsWith("/auth/forgot-password") ||
                     isStorePage; // Hide navbar on store pages

  const hideFooter = pathname?.startsWith("/admin") || 
                     pathname?.startsWith("/dashboard") || 
                     pathname?.startsWith("/auth/login") || 
                     pathname?.startsWith("/auth/register") ||
                     pathname?.startsWith("/user") ||
                     pathname?.startsWith("/auth/forgot-password");
  // Note: isStorePage is NOT in hideFooter, so footer shows on store pages

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Navbar - Hidden on store pages and other protected routes */}
      {!hideNavbar && (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
          <div className={styles.container}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <ShoppingBag size={28} className={styles.logoIcon} />
              <span className={styles.logoText}>WhatsApp<span className={styles.logoHighlight}>Commerce</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>
                Home
              </Link>
              <Link href="/features" className={`${styles.navLink} ${pathname === "/features" ? styles.active : ""}`}>
                Features
              </Link>
              <Link href="/how-it-works" className={`${styles.navLink} ${pathname === "/how-it-works" ? styles.active : ""}`}>
                How It Works
              </Link>
              <Link href="/pricing" className={`${styles.navLink} ${pathname === "/pricing" ? styles.active : ""}`}>
                Pricing
              </Link>
              <Link href="/vendors" className={`${styles.navLink} ${pathname === "/vendors" ? styles.active : ""}`}>
                Vendors
              </Link>
              <Link href="/blog" className={`${styles.navLink} ${pathname === "/blog" ? styles.active : ""}`}>
                Blog
              </Link>
              <Link href="/about" className={`${styles.navLink} ${pathname === "/about" ? styles.active : ""}`}>
                About
              </Link>

              {/* Dropdown Menu Example */}
              <div className={styles.dropdown}>
                <button className={styles.dropdownTrigger}>
                  Resources
                  <ChevronDown size={16} />
                </button>
                <div className={styles.dropdownMenu}>
                  <Link href="/help" className={styles.dropdownItem}>
                    <MessageCircle size={16} />
                    Help Center
                  </Link>
                  <Link href="/guides" className={styles.dropdownItem}>
                    <Store size={16} />
                    Vendor Guides
                  </Link>
                  <Link href="/faq" className={styles.dropdownItem}>
                    FAQ
                  </Link>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className={styles.authButtons}>
              <Link href="/auth/login" className={styles.loginButton}>
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link href="/register" className={styles.registerButton}>
                <UserPlus size={18} />
                <span>Register</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ""}`}>
            <div className={styles.mobileNavContent}>
              <Link href="/" className={styles.mobileNavLink}>
                Home
              </Link>
              <Link href="/features" className={styles.mobileNavLink}>
                Features
              </Link>
              <Link href="/how-it-works" className={styles.mobileNavLink}>
                How It Works
              </Link>
              <Link href="/pricing" className={styles.mobileNavLink}>
                Pricing
              </Link>
              <Link href="/vendors" className={styles.mobileNavLink}>
                Vendors
              </Link>
              <Link href="/blog" className={styles.mobileNavLink}>
                Blog
              </Link>
              <Link href="/about" className={styles.mobileNavLink}>
                About
              </Link>
              <Link href="/help" className={styles.mobileNavLink}>
                Help Center
              </Link>
              <Link href="/guides" className={styles.mobileNavLink}>
                Vendor Guides
              </Link>
              
              <div className={styles.mobileAuthButtons}>
                <Link href="/auth/login" className={styles.mobileLoginButton}>
                  <LogIn size={18} />
                  Login
                </Link>
                <Link href="/register" className={styles.mobileRegisterButton}>
                  <UserPlus size={18} />
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={isStorePage ? styles.storeMainContent : styles.mainContent}>
        {children}
      </main>

      {/* Footer - Hidden only on protected routes, shows on store pages */}
      {!hideFooter && <Footer />}
    </>
  );
}