// app/components/NavbarFooterWrapper.js
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "./footer";

export default function NavbarFooterWrapper({ children }) {
  const pathname = usePathname();
  
  const hideNavbarFooter = pathname?.startsWith("/admin") || 
                          pathname?.startsWith("/dashboard") || 
                          pathname?.startsWith("/auth/login") || 
                          pathname?.startsWith("/auth/register")||
                          pathname?.startsWith("/auth/forgot-password");

  return (
    <>
      {!hideNavbarFooter && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow mb-4">
          <div className="container">
            <Link className="navbar-brand" href="/">
              MyApp
            </Link>

            <div className="navbar-nav">
              <Link className="nav-link" href="/blog">
                Blog
              </Link>
              <Link className="nav-link" href="/about">
                About
              </Link>
              <Link className="nav-link" href="/auth/login">
                Login
              </Link>
            </div>
          </div>
        </nav>
      )}
      <main>{children}</main>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}