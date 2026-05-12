"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboard3Line,
  RiGroupLine,
  RiBuilding4Line,
  RiSettings5Line,
  RiLogoutBoxRLine,
  RiMenu4Fill,
  RiCloseFill,
  RiUserLine,
  RiNotification3Line,
} from "react-icons/ri";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser.role !== "admin") {
      router.push("/");
    }
  }, [router]);

  if (!mounted || !user || user.role !== "admin") return null;

  const navItems = [
    { name: "Dashboard", icon: <RiDashboard3Line />, path: "/admin" },
    { name: "Users", icon: <RiGroupLine />, path: "/admin/users" },
    { name: "Businesses", icon: <RiBuilding4Line />, path: "/admin/businesses" },
    { name: "Settings", icon: <RiSettings5Line />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans antialiased text-slate-900">
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-[70] fixed lg:sticky top-0 h-screen 
        ${isSidebarOpen ? "w-64" : "w-20"} 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-20 flex items-center px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 flex-shrink-0">
              <RiUserLine className="text-white text-xl" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-tight text-slate-800">
                Core<span className="text-indigo-600">Admin</span>
              </span>
            )}
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                title={!isSidebarOpen ? item.name : ""}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 
                  ${isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className={`text-2xl ${isActive ? "text-indigo-600" : "group-hover:text-slate-700"}`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                {isActive && (
                    <span className="absolute left-0 w-1 h-5 bg-indigo-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-3">
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
          
                <span>Back to Home</span> </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
          >
            <RiLogoutBoxRLine className="text-2xl" />
            {isSidebarOpen && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) setIsMobileMenuOpen(!isMobileMenuOpen);
                else setIsSidebarOpen(!isSidebarOpen);
              }} 
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RiMenu4Fill size={22} />
            </button>
            
            {/* Breadcrumb - Hidden on mobile */}
            <nav className="hidden md:flex items-center text-sm font-medium">
                <span className="text-slate-400">Pages</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-800 capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
                <RiNotification3Line size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;