import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import type { Product } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // check if product is in cart and get quantity
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart size={18} />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-blue-600 text-white rounded-lg">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 hover:bg-blue-700 rounded-l-lg transition"
              >
                <Minus size={18} />
              </button>
              <span className="px-3 py-2 font-semibold">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="px-3 py-2 hover:bg-blue-700 rounded-r-lg transition"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
