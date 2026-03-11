import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const userContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const vendor = await axios.get("/api/vendor/me");

        let vendorsProducts = vendor.data.store.products;
        setUserInfo(vendor.data);
        setProducts(vendorsProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-muted" style={{ fontWeight: "5000" }}>
            Loading user data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <userContext.Provider
      value={{ userInfo, loading, error, products, setProducts , handleLogout}}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
