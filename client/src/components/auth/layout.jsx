//client/src/components/auth/layout.jsx
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section - Luxury Gradient Background */}
      <div className="hidden lg:flex items-center justify-center w-1/2 px-12 bg-gradient-to-br from-slate-900 via-amber-900 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-600/5"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl"></div>
        
        <div className="max-w-md space-y-8 text-center text-white relative z-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
              Welcome to Rekker
            </h1>
            <h2 className="text-2xl font-light tracking-wide text-amber-100/90">
              Premium Collection
            </h2>
          </div>
          
          <div className="space-y-6 text-amber-100/80">
            <p className="text-lg font-light leading-relaxed">
              Where sophistication meets exceptional quality. Discover our curated selection of premium products.
            </p>
            
            <div className="flex flex-col space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="font-medium">Exclusive Collections</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="font-medium">Premium Quality Assured</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="font-medium">Personalized Service</span>
              </div>
            </div>
          </div>
          
          {/* Luxury Badge */}
          <div className="inline-block px-6 py-2 border border-amber-400/30 rounded-full backdrop-blur-sm bg-amber-400/10">
            <span className="text-amber-200 text-sm font-medium tracking-wider">EST. 2008 • NAIROBI</span>
          </div>
        </div>
      </div>

      {/* Right Section - Clean Background */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30 px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;