// // components/ProductModal.jsx
// "use client";

// import { useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { X, ShoppingCart, Heart, Star, Check, MessageCircle } from "lucide-react";

// export default function ProductModal({ 
//   product, 
//   show, 
//   onClose, 
//   storeSlug, 
//   onAddToCart, 
//   addedToCart, 
//   isInCart,
//   storeData 
// }) {
//   // Close on escape key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     if (show) {
//       document.addEventListener("keydown", handleEsc);
//       document.body.style.overflow = "hidden";
//     }
//     return () => {
//       document.removeEventListener("keydown", handleEsc);
//       document.body.style.overflow = "unset";
//     };
//   }, [show, onClose]);

//   if (!show || !product) return null;

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div
//       className="modal-backdrop fade show"
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         zIndex: 1060,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(5px)",
//       }}
//       onClick={handleBackdropClick}
//     >
//       <div
//         className="modal-dialog modal-dialog-centered"
//         style={{
//           maxWidth: "500px",
//           width: "90%",
//           margin: "0 auto",
//           animation: "modalSlideIn 0.3s ease",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
        
//         <div className="modal-content border-0 rounded-4 shadow-lg">
//           {/* Header with close button */}
//           <div className="modal-header border-0 pb-0 justify-content-end">
//             <button
//               type="button"
//               className="btn-close"
//               onClick={onClose}
//               aria-label="Close"
//             ></button>
//           </div>
//           <h1>goodness</h1>

//           {/* Product image */}
//           <div className="text-center px-4">
//             <div
//               className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center p-4"
//               style={{ width: "200px", height: "200px" }}
//             >
//               {product.image ? (
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   width={180}
//                   height={180}
//                   className="object-fit-contain"
//                 />
//               ) : (
//                 <div className="text-secondary">
//                   <ShoppingCart size={80} className="opacity-25" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Product details */}
//           <div className="modal-body pt-3 px-4">
//             <h3 className="fw-bold mb-1">{product.name}</h3>
            
//             {/* Rating */}
//             <div className="d-flex align-items-center gap-2 mb-3">
//               <div className="d-flex align-items-center gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     className={i < 4 ? "text-warning fill-warning" : "text-secondary"}
//                   />
//                 ))}
//               </div>
//               <span className="text-secondary small">(24 reviews)</span>
//             </div>

//             {/* Price */}
//             <div className="mb-3">
//               <span className="display-6 fw-bold text-success">
//                 ${parseFloat(product.price).toFixed(2)}
//               </span>
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <h6 className="fw-semibold mb-2">Description</h6>
//               <p className="text-secondary mb-0">
//                 {product.description || "No description available for this product."}
//               </p>
//             </div>

//             {/* Additional details if available */}
//             {product.category && (
//               <div className="mb-3">
//                 <span className="badge bg-light text-dark p-2">
//                   Category: {product.category}
//                 </span>
//               </div>
//             )}

//             {/* Action buttons */}
//             <div className="d-flex gap-2 mt-4">
//               <button
//                 className={`btn flex-grow-1 py-3 ${
//                   addedToCart?.[product.id]
//                     ? "btn-success"
//                     : "btn-success"
//                 }`}
//                 onClick={(e) => onAddToCart(product, e)}
//               >
//                 {addedToCart?.[product.id] ? (
//                   <>
//                     <Check size={18} className="me-2" />
//                     Added to Cart
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart size={18} className="me-2" />
//                     Add to Cart
//                   </>
//                 )}
//               </button>
              
//               <Link
//                 href={`/store/${storeSlug}/product/${product.id}`}
//                 className="btn btn-outline-secondary py-3"
//               >
//                 View Details
//               </Link>
//             </div>

//             {/* WhatsApp contact */}
//             {storeData?.whatsappNumber && (
//               <a
//                 href={`https://wa.me/${storeData.whatsappNumber.replace(/\D/g, "")}?text=Hi, I'm interested in ${product.name}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="btn btn-outline-success w-100 mt-2 py-2"
//               >
//                 <MessageCircle size={18} className="me-2" />
//                 Ask on WhatsApp
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes modalSlideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .fill-warning {
//           fill: #ffc107;
//         }
//       `}</style>
//     </div>
//   );
// }


// components/ProductModal.jsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Heart, Star, Check, MessageCircle } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
export default function ProductModal({ 
  product, 
  show, 
  onClose, 
  storeSlug, 
  onAddToCart, 
  addedToCart, 
  isInCart,
  storeData 
}) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (show) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [show, onClose]);

  if (!show || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="product-modal-overlay" // Changed from modal-backdrop
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1060,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(5px)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="product-modal-dialog" // Changed from modal-dialog
        style={{
          maxWidth: "500px",
          width: "90%",
          margin: "0 auto",
          animation: "modalSlideIn 0.3s ease",
          position: "relative", // Ensure positioning
          zIndex: 1061, // Higher than overlay
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-modal-content bg-white rounded-4 shadow-lg overflow-hidden">
          {/* Header with close button */}
          <div className="d-flex justify-content-end p-3 border-0">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Product image */}
          <div className="text-center px-4">
            <div
              className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center p-4"
              style={{ width: "200px", height: "200px" }}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={180}
                  height={180}
                  className="object-fit-contain"
                />
              ) : (
                <div className="text-secondary">
                  <ShoppingCart size={80} className="opacity-25" />
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="p-4 pt-3">
            <h3 className="fw-bold mb-1">{product.name}</h3>
            
            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < 4 ? "text-warning fill-warning" : "text-secondary"}
                  />
                ))}
              </div>
              <span className="text-secondary small">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-3">
              <span className="display-6 fw-bold text-success">
                ₦{parseFloat(product.price).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-2">Description</h6>
              <p className="text-secondary mb-0">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Additional details if available */}
            {product.category && (
              <div className="mb-3">
                <span className="badge bg-light text-dark p-2">
                  Category: {product.category}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="d-flex gap-2 mt-4">
              <button
                className={`btn flex-grow-1 py-3 ${
                  addedToCart?.[product.id]
                    ? "btn-success"
                    : "btn-success"
                }`}
                onClick={(e) => onAddToCart(product, e)}
              >
                {addedToCart?.[product.id] ? (
                  <>
                    <Check size={18} className="me-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} className="me-2" />
                    Add to Cart
                  </>
                )}
              </button>
              
              <Link
                href={`/store/${storeSlug}/product/${product.id}`}
                className="btn btn-outline-secondary py-3"
              >
                View Details
              </Link>
            </div>

            {/* WhatsApp contact */}
            {storeData?.whatsappNumber && (
           <a
  href={`https://wa.me/${storeData.whatsappNumber.replace(/\D/g, "")}?text=Hi, I'm interested in ${product.name}`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-success w-100 mt-2 py-2 d-inline-flex align-items-center justify-content-center gap-2"
>
  <FontAwesomeIcon icon={faWhatsapp} fontSize="30px" />
  <span>Ask on WhatsApp</span>
</a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fill-warning {
          fill: #ffc107;
        }
        
        /* Add these styles to ensure modal content is visible */
        .product-modal-content {
          background: white;
          position: relative;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
    </div>
  );
}