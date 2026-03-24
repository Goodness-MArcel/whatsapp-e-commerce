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
  const[Order, setOreders] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const vendor = await axios.get("/api/vendor/me");
        console.log(vendor);

        let vendorsProducts = vendor.data.store.products;
      let vendorsOrders = vendor.data.store.orders;
      console.log('the oders',vendorsOrders);
        setUserInfo(vendor.data);
        setProducts(vendorsProducts);
        setOreders(vendorsOrders);
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
      value={{ userInfo, loading, error, products, setProducts ,Order, handleLogout}}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
