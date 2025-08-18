/* eslint-disable no-unused-vars */
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Heart, HeartOff, Phone, MapPin, Clock, Truck, ChevronDown, ChevronUp, Crown } from "lucide-react";
import logo from "../../assets/Rekker_Logo.jpg"; // Updated logo path
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import WishlistSheet from "./wishlist-sheet";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <div className="flex flex-col gap-2">
      <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row pt-8 lg:pt-6">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer hover:text-amber-600 transition-all duration-300 hover:scale-105 relative group"
            key={menuItem.id}
          >
            {menuItem.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Label>
        ))}
      </nav>
    </div>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const wishlistItems = useSelector((state) => state.shopWishlist.items || []);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openWishlistSheet, setOpenWishlistSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:bg-amber-50 hover:border-amber-200 transition-all duration-300 group"
        >
          <ShoppingCart className="w-6 h-6 group-hover:text-amber-600 transition-colors" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cartItems.items.length}
            </span>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems?.items?.length > 0 ? cartItems.items : []
          }
        />
      </Sheet>

      {/* Wishlist */}
      <Sheet open={openWishlistSheet} onOpenChange={setOpenWishlistSheet}>
        <Button
          onClick={() => setOpenWishlistSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:bg-amber-50 hover:border-amber-200 transition-all duration-300 group"
        >
          <Heart className="w-6 h-6 text-amber-600 group-hover:fill-amber-600 transition-all" />
          {wishlistItems?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {wishlistItems.length}
            </span>
          )}
          <span className="sr-only">Wishlist</span>
        </Button>
        <WishlistSheet setOpenWishlistSheet={setOpenWishlistSheet} />
      </Sheet>

      {/* Account */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-gradient-to-br from-amber-600 to-amber-800 hover:cursor-pointer hover:from-amber-700 hover:to-amber-900 transition-all duration-300 border-2 border-amber-200">
            <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-800 text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 border-amber-200">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")} className="hover:bg-amber-50">
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileContactInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Luxury Contact Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-amber-100 overflow-hidden">
            <div className="flex items-center whitespace-nowrap">
              <Phone className="h-3 w-3 mr-1 text-amber-300 flex-shrink-0" />
              <span className="font-medium">+254 736 601 307</span>
            </div>
            <div className="flex items-center whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1 text-amber-300 flex-shrink-0" />
              <span className="font-medium">8:00 AM - 8:00 PM</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 text-amber-100 hover:bg-amber-800/50"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        {/* Expanded Contact Info */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-700/50 space-y-2">
            <div className="flex items-center text-xs text-amber-100">
              <MapPin className="h-3 w-3 mr-2 text-amber-300 flex-shrink-0" />
              <span className="font-semibold text-amber-200">Showroom:</span>
              <span className="ml-1 font-medium">Prestige Plaza, Westlands, Nairobi</span>
            </div>
            
            <div className="flex items-start text-xs text-amber-100">
              <Truck className="h-3 w-3 mr-2 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200">Premium Delivery:</span>
                <span className="ml-1 font-medium">White-glove service available</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopContactInfo() {
  return (
    <div className="hidden lg:block mt-2">
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-lg px-4 py-3 shadow-lg border border-amber-700/30">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center text-amber-100">
            <Phone className="h-3 w-3 mr-2 text-amber-300" />
            <span className="font-semibold text-amber-200">Phone:</span>
            <span className="ml-1 font-medium">+254 736 601 307</span>
          </div>
          
          <div className="flex items-center text-amber-100">
            <MapPin className="h-3 w-3 mr-2 text-amber-300" />
            <span className="font-semibold text-amber-200">Showroom:</span>
            <span className="ml-1 font-medium">Prestige Plaza, Westlands</span>
          </div>
          
          <div className="flex items-center text-amber-100">
            <Clock className="h-3 w-3 mr-2 text-amber-300" />
            <span className="font-semibold text-amber-200">Hours:</span>
            <span className="ml-1 font-medium">8:00 AM - 8:00 PM</span>
          </div>
          
          <div className="flex items-center text-amber-100">
            <Crown className="h-3 w-3 mr-2 text-amber-300" />
            <span className="font-semibold text-amber-200">Premium:</span>
            <span className="ml-1 font-medium">White-glove delivery service</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md border-amber-200/50 shadow-sm">
      {/* Mobile Contact Info Bar */}
      <MobileContactInfo />
      
      {/* Main Header */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-3 group">
          <div className="relative">
            <Crown className="h-8 w-8 text-amber-600 group-hover:text-amber-700 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
              REKKER
            </span>
            <span className="text-xs text-amber-600 font-medium tracking-wider -mt-1">
              PREMIUM COLLECTION
            </span>
          </div>
        </Link>
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden hover:bg-amber-50 hover:border-amber-200">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-gradient-to-b from-amber-50 to-white">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        
        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
          <DesktopContactInfo />
        </div>

        {/* Desktop Right Content */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;