"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product, storeSlug }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = (e) => {
    e.preventDefault();
    // Add your interactive logic here
    console.log("Viewing product:", product.id);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.id);
    // Add to cart logic here
  };

  // Generate random rating for demo (you can replace with actual rating)
  const rating = (Math.random() * 2 + 3).toFixed(1); // Random between 3.0 and 5.0

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/store/${storeSlug}/product/${product.id}`}>
        <div className="aspect-square relative bg-gray-100 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay with actions on hover */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleViewDetails}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
              title="Quick view"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
              title="Add to cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>

          {/* Discount Badge (example - you can make this dynamic) */}
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -20%
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 50) + 10})</span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {parseFloat(product.price) > 100 && (
                <span className="ml-2 text-xs text-green-600 font-medium">
                  Free shipping
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}