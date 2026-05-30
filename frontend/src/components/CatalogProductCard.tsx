import React, { useState } from "react";
import { useCart } from "../store/cart.js";
import { ShoppingCartIcon, CheckIcon, ImageIcon } from "lucide-react";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number; // in cents
  description: string;
  currency: string;
  imageUrl?: string | null;
  active: boolean;
}

interface CatalogProductCardProps {
  product: Product;
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const addItem = useCart((s: any) => s.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product.id, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "USD",
  }).format(product.price / 100);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-base-200">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-base-content/30">
            <ImageIcon className="h-12 w-12 stroke-[1.5]" />
            <span className="mt-2 text-xs font-medium">No image available</span>
          </div>
        )}

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="badge border-0 bg-base-100/90 text-xs font-bold uppercase tracking-wider text-base-content shadow-sm backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-base-content transition-colors duration-200 group-hover:text-primary">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-base-content/65">
          {product.description || "No description provided."}
        </p>

        {/* Action / Price Row */}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-base-200 pt-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-base-content/50 font-semibold">
              Price
            </span>
            <span className="text-xl font-extrabold text-base-content font-mono">
              {formattedPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`btn btn-sm gap-2 rounded-xl px-4 transition-all duration-200 ${
              isAdded
                ? "btn-success text-success-content"
                : "btn-primary hover:shadow-md hover:shadow-primary/20"
            }`}
          >
            {isAdded ? (
              <>
                <CheckIcon className="h-4 w-4 stroke-[2.5] animate-scale-in" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4 stroke-2" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
