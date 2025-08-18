/* eslint-disable react/prop-types */
// client/src/components/shopping-view/product-tile.jsx
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, HeartOff, Star, Crown, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const wishlistState = useSelector((state) => state.shopWishlist);
  const wishlistItems = wishlistState?.items || [];

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent triggering product details modal

    if (!user) {
      toast({
        title: "Please login to use wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ userId: user.id, productId: product._id }));
        toast({
          title: "Removed from collection",
          description: "Item removed from your wishlist",
        });
      } else {
        await dispatch(addToWishlist({ userId: user.id, productId: product._id }));
        toast({
          title: "Added to collection",
          description: "Item saved to your wishlist",
        });
      }

      // ✅ Refresh wishlist after update
      dispatch(fetchWishlist(user.id));
    } catch (err) {
      toast({
        title: "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Calculate savings percentage if on sale
  const savingsPercentage = product?.salePrice > 0 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card className="relative w-full max-w-sm mx-auto group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-b from-white to-amber-50/30 border-amber-100 overflow-hidden">
      {/* Premium Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-none shadow-lg">
          <Crown className="w-3 h-3 mr-1" />
          PREMIUM
        </Badge>
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300"
          onClick={toggleWishlist}
        >
          {isWishlisted ? (
            <Heart className="w-5 h-5 text-amber-600 fill-amber-600" />
          ) : (
            <Heart className="w-5 h-5 text-gray-400 hover:text-amber-600 transition-colors" />
          )}
        </Button>
      </div>

      {/* Product Click Section */}
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[320px] object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Stock/Sale Badges */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            {product?.totalStock === 0 ? (
              <Badge className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Only {product?.totalStock} left
              </Badge>
            ) : product?.salePrice > 0 ? (
              <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                {savingsPercentage}% OFF
              </Badge>
            ) : null}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">
                {categoryOptionsMap[product?.category]}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm text-gray-600">4.8</span>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors leading-tight">
              {product?.title}
            </h2>
          </div>
          
          <div className="flex justify-between items-center">
            {product?.salePrice > 0 ? (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-amber-600">
                  KES {product?.salePrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  KES {product?.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-amber-600">
                KES {product?.price.toLocaleString()}
              </span>
            )}
            
            {savingsPercentage > 0 && (
              <div className="text-right">
                <div className="text-xs text-green-600 font-medium">You save</div>
                <div className="text-sm font-bold text-green-600">
                  KES {(product.price - product.salePrice).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Cart Button */}
      <CardFooter className="p-6 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
            <Shield className="w-4 h-4 mr-2" />
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Crown className="w-4 h-4 mr-2" />
            Add to Collection
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;