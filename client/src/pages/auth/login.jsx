/* eslint-disable no-unused-vars */
//client/src/pages/auth/login.jsx
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, syncFirebaseAuth } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { AuthProviders } from "@/components/auth/auth-providers";
import { Crown, Shield, Star } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetRoute = user.role === 'admin' ? '/admin/dashboard' : '/shop/home';
      console.log('🎯 Navigation triggered - User role:', user.role, '-> Route:', targetRoute);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Helper function to handle successful login navigation
  const handleSuccessfulLogin = (userData, message = "Welcome back to Rekker!") => {
    toast({ 
      title: message,
      description: "Accessing your premium collection..."
    });
    console.log('✅ Login successful for user:', {
      email: userData.email || userData.userName,
      role: userData.role
    });
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Starting Firebase authentication...');
      
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log('✅ Firebase login successful:', userCredential.user.email);
      
      // Firebase auth state change will trigger the sync in App.jsx
      // We don't need to manually sync here anymore
      
      // Just show success message - navigation will be handled by useEffect
      handleSuccessfulLogin({ 
        email: userCredential.user.email,
        role: 'pending...' // Will be updated after sync
      });
      
    } catch (firebaseError) {
      console.error('❌ Firebase login error:', firebaseError);
      
      // If Firebase fails, try traditional backend login
      try {
        console.log('🔄 Trying traditional backend login...');
        const response = await dispatch(loginUser({ formData }));
        
        if (response?.payload?.success) {
          handleSuccessfulLogin(response.payload.user);
          // Navigation will be handled by useEffect
        } else {
          throw new Error(response?.payload?.message || 'Backend login failed');
        }
      } catch (backendError) {
        console.error('❌ Backend login error:', backendError);
        
        // Provide specific error messages
        let errorMessage = "Authentication failed. Please verify your credentials.";
        
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = "Account not found. Please register for exclusive access.";
        } else if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = "Incorrect password. Please try again.";
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = "Please enter a valid email address.";
        } else if (firebaseError.code === 'auth/user-disabled') {
          errorMessage = "Account access suspended. Contact our concierge team.";
        } else if (firebaseError.code === 'auth/invalid-credential') {
          errorMessage = "Invalid credentials. Please check your details.";
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }

        toast({
          title: "Access Denied",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google/Social login success
  const handleSocialLoginSuccess = (userData) => {
    console.log('🎉 Social login successful:', userData);
    handleSuccessfulLogin(userData.user || userData, "Welcome to your premium experience!");
    // Navigation will be handled by useEffect when Redux state updates
  };

  // Handle social login error
  const handleSocialLoginError = (error) => {
    console.error('❌ Social login error:', error);
    toast({
      title: "Authentication failed",
      description: error,
      variant: "destructive"
    });
  };

  // Don't render the form if already authenticated
  if (isAuthenticated && user) {
    console.log('👤 User already authenticated, hiding login form');
    return null; // Let useEffect handle navigation
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      {/* Luxury Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-amber-600" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
              REKKER
            </span>
            <span className="text-xs text-amber-600 font-medium tracking-widest -mt-1">
              PREMIUM ACCESS
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-amber-700 font-medium">
            Access your exclusive collection
          </p>
        </div>
        
        {/* Premium Features */}
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-600 font-medium">Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-600 font-medium">Premium</span>
          </div>
          <div className="flex items-center gap-1">
            <Crown className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-600 font-medium">Exclusive</span>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600">
          New to Rekker?
          <Link
            className="font-semibold ml-2 text-amber-600 hover:text-amber-700 hover:underline transition-all duration-300"
            to="/auth/register"
          >
            Join the Collection
          </Link>
        </p>
      </div>
      
      {/* Premium Form Wrapper */}
      <div className="bg-gradient-to-br from-white to-amber-50/30 p-6 rounded-2xl border border-amber-200/50 shadow-lg">
        <CommonForm
          formControls={loginFormControls}
          buttonText={isLoading ? "Authenticating..." : "Access Collection"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          disabled={isLoading}
        />
      </div>
      
      {/* Elegant Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-amber-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-amber-50 to-white px-4 text-amber-600 font-medium tracking-wider">
            Or continue with premium access
          </span>
        </div>
      </div>

      {/* Social Login */}
      <div className="bg-gradient-to-br from-white to-amber-50/30 p-4 rounded-2xl border border-amber-200/50">
        <AuthProviders 
          onSuccess={handleSocialLoginSuccess}
          onError={handleSocialLoginError}
        />
      </div>

      {/* Trust Indicators */}
      <div className="text-center text-xs text-gray-500 space-y-2">
        <p className="flex items-center justify-center gap-2">
          <Shield className="w-3 h-3 text-amber-600" />
          Protected by enterprise-grade security
        </p>
        <p>
          Your data is encrypted and never shared
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;