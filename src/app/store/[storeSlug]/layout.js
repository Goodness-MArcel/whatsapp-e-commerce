// import { CartProvider } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
// import { CartProvider } from "../context/CartContext";  
import { CartProvider } from "../../context/CartContext";

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}