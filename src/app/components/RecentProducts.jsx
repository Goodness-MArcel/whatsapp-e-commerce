// components/RecentProducts.jsx
import Link from "next/link";
import { Package, Clock, Edit } from "lucide-react";

// Make sure this is a default export
const RecentProducts = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold mb-0">Recent Products</h6>
          <Link href="/products/add" className="text-success text-decoration-none small">
            Add first product
          </Link>
        </div>
        <div className="text-center py-5 bg-light rounded-3">
          <Package size={32} className="text-secondary mx-auto mb-2" />
          <p className="text-secondary mb-1">No products yet</p>
          <small className="text-secondary">Start adding your products</small>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold mb-0">Recent Products</h6>
        <Link href="/products" className="text-success text-decoration-none small">
          View all
        </Link>
      </div>

      <div className="d-flex flex-column gap-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="text-decoration-none"
          >
            <div className="bg-light rounded-3 p-2">
              <div className="d-flex align-items-center gap-3">
                {/* Product Image */}
                <div 
                  className="bg-white rounded-2 d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px", overflow: "hidden" }}
                >
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Package size={24} className="text-secondary" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-semibold mb-1 text-dark">{product.name}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-success fw-medium">${product.price}</small>
                        <span className="text-secondary">•</span>
                        <small className="text-secondary d-flex align-items-center gap-1">
                          <Clock size={12} />
                          {product.addedTime}
                        </small>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-light p-1 rounded-circle">
                      <Edit size={14} className="text-secondary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// This is the crucial part - make sure you have this export
export default RecentProducts;