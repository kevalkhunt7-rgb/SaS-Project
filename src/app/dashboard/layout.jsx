"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  RiDashboard3Line, 
  RiBookOpenLine, 
  RiChatSmile2Line, 
  RiTicket2Line, 
  RiSettings5Line,
  RiLogoutCircleLine,
  RiRobot3Fill,
  RiMenu4Fill,
  RiCloseFill,
  RiNotification3Line,
  RiPencilFill,
  RiShieldStarLine,
  RiArrowDownSLine
} from "react-icons/ri";
import { businessApi, subscriptionApi } from "@/lib/api";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [business, setBusiness] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchBusiness();
      fetchSubscription();
    }
  }, [router, pathname]); // Re-fetch on pathname change to catch subscription updates

  const fetchBusiness = async () => {
    try {
      const res = await businessApi.getMyBusiness();
      if (res.data.success) {
        setBusiness(res.data.business);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await subscriptionApi.getCurrent();
      if (res.data.success) {
        setSubscription(res.data.subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);
    setIsUploading(true);

    try {
      const res = await businessApi.update(formData);
      if (res.data.success) {
        setBusiness(res.data.business);
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!mounted) return null;

  const navItems = [
    { name: "Overview", icon: <RiDashboard3Line />, path: "/dashboard" },
    { name: "AI Assistant", icon: <RiRobot3Fill />, path: "/dashboard/ai-assistant" },
    { name: "Knowledge Base", icon: <RiBookOpenLine />, path: "/dashboard/knowledge" },
    { name: "Widget", icon: <RiChatSmile2Line />, path: "/dashboard/widget" },
    { name: "Conversations", icon: <RiChatSmile2Line />, path: "/dashboard/conversations" },
    { name: "Tickets", icon: <RiTicket2Line />, path: "/dashboard/tickets" },
    { name: "Subscription", icon: <RiShieldStarLine />, path: "/dashboard/subscription" },
    { name: "Settings", icon: <RiSettings5Line />, path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900 overflow-x-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200/60 transition-all duration-500 ease-in-out z-50 fixed lg:static h-screen 
        ${isSidebarOpen ? "w-72" : "w-24"} 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-20 flex items-center px-7 gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <RiRobot3Fill className="text-white text-2xl shrink-0" />
          </div>
          {isSidebarOpen && (
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SupportAI
            </span>
          )}
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className={`text-2xl transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                
                {isSidebarOpen && <span className="text-[15px]">{item.name}</span>}
                
                {/* Active Indicator Pill */}
                {isActive && (
                  <div className="absolute right-0 w-1 h-6 bg-blue-600 rounded-l-full" />
                )}

                {/* Tooltip for collapsed mode */}
                {!isSidebarOpen && (
                  <div className="absolute left-20 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <Link 
      href="/" 
      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200 ease-in-out"
    >
      {/* Back Arrow Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-transform duration-200" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>

      <span>Back to Home</span>
    </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all  group"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform"><RiLogoutCircleLine /></span>
            {isSidebarOpen && <span className="font-semibold text-[15px]">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                if (window.innerWidth < 1024) setIsMobileMenuOpen(!isMobileMenuOpen);
              }} 
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <RiCloseFill size={24} /> : <RiMenu4Fill size={24} />}
            </button>
            <h1 className="text-sm font-medium text-slate-400 hidden lg:block">
              Pages / <span className="text-slate-900 capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Current Plan Badge with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all group"
              >
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Plan</span>
                <span className="text-xs font-bold text-blue-700">{subscription?.plan || business?.plan || "Free"}</span>
                <RiArrowDownSLine className={`text-blue-400 transition-transform duration-200 ${isPlanDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPlanDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    href="/dashboard/subscription"
                    onClick={() => setIsPlanDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <RiShieldStarLine size={18} />
                    Upgrade Plan
                  </Link>
                </div>
              )}
            </div>

            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors hidden xs:block">
              <RiNotification3Line size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-3 group relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">
                  {business?.businessName || "Business User"}
                </p>
                
              </div>
              
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-blue-100">
                  <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-blue-600 font-black overflow-hidden relative">
                    {business?.logo?.url ? (
                      <img src={business.logo.url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg uppercase">
                        {business?.businessName?.charAt(0) || "A"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;