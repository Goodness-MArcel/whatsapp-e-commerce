// components/Footer.jsx
import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight,
  Heart,
  Shield,
  Truck,
  CreditCard,
  Smartphone,
  MessageCircle,
  Store
} from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Company Info */}
            <div className={styles.column}>
              <div className={styles.logoWrapper}>
                <Store size={28} className={styles.logoIcon} />
                <Image
                  src="/next.svg"
                  alt="WhatsApp Commerce"
                  width={120}
                  height={24}
                  className={styles.logo}
                />
              </div>
              <p className={styles.companyDescription}>
                The complete commerce platform for WhatsApp vendors. 
                Sell smarter, grow faster with integrated WhatsApp selling.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Mail size={16} />
                  <a href="mailto:support@whatsappcommerce.com">
                    support@whatsappcommerce.com
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={16} />
                  <a href="tel:+18001234567">+1 (800) 123-4567</a>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={16} />
                  <span>San Francisco, CA 94105</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Quick Links</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/about">
                    <ChevronRight size={14} />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/features">
                    <ChevronRight size={14} />
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing">
                    <ChevronRight size={14} />
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/vendors">
                    <ChevronRight size={14} />
                    Vendors
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <ChevronRight size={14} />
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Support</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/help">
                    <ChevronRight size={14} />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <ChevronRight size={14} />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <ChevronRight size={14} />
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <ChevronRight size={14} />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <ChevronRight size={14} />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Features</h3>
              <div className={styles.featureGrid}>
                <div className={styles.featureItem}>
                  <Smartphone size={20} />
                  <div>
                    <h4>WhatsApp Integration</h4>
                    <p>Sell directly on WhatsApp</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <Truck size={20} />
                  <div>
                    <h4>Order Management</h4>
                    <p>Track orders in real-time</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <CreditCard size={20} />
                  <div>
                    <h4>Secure Payments</h4>
                    <p>Multiple payment options</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <Shield size={20} />
                  <div>
                    <h4>Vendor Protection</h4>
                    <p>Seller protection policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterText}>
              <h3>Stay updated with the latest features</h3>
              <p>Join 10,000+ vendors getting our weekly newsletter</p>
            </div>
            <form className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterButton}>
                  Subscribe
                </button>
              </div>
              <p className={styles.newsletterNote}>
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={styles.bottomFooter}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>© {currentYear} WhatsApp Commerce. All rights reserved.</p>
              <div className={styles.madeWith}>
                <Heart size={14} />
                <span>Made for WhatsApp vendors</span>
              </div>
            </div>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://wa.me/18001234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.whatsapp}`}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>

            {/* Payment Methods */}
            <div className={styles.paymentMethods}>
              <span className={styles.paymentLabel}>We accept:</span>
              <div className={styles.paymentIcons}>
                <span className={styles.paymentIcon}>Visa</span>
                <span className={styles.paymentIcon}>Mastercard</span>
                <span className={styles.paymentIcon}>PayPal</span>
                <span className={styles.paymentIcon}>UPI</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span className={styles.separator}>•</span>
            <Link href="/terms">Terms of Service</Link>
            <span className={styles.separator}>•</span>
            <Link href="/cookies">Cookie Policy</Link>
            <span className={styles.separator}>•</span>
            <Link href="/sitemap">Sitemap</Link>
            <span className={styles.separator}>•</span>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}