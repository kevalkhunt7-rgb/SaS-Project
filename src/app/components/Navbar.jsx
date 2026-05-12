"use client";

import React, { useEffect, useState } from 'react';
import { Menu, X, Bot, LayoutDashboard, UserCircle } from 'lucide-react';
import { RiSettings5Line } from "react-icons/ri";
import Link from "next/link";
import { businessApi } from '@/lib/api';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasBusiness, setHasBusiness] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#Howtodo' },
        { name: 'Pricing', href: '#pricing' },
    ];

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        setToken(storedToken);
        
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
            }
        }

        if (storedToken) {
            checkBusiness();
        }
    }, []);

    const checkBusiness = async () => {
        try {
            const res = await businessApi.getMyBusiness();
            if (res.data.success) {
                setHasBusiness(true);
            }
        } catch (error) {
            setHasBusiness(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setHasBusiness(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-blue-50 bg-white/70 backdrop-blur-md">
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="  text-3xl  ">
                            <Bot size={44} className="text-black " />
                        </div>

                       <img src="./logo.png" className='w-44' alt="" />
                    </Link>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {token && (
                            <>
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                                    >
                                        <RiSettings5Line size={18} />
                                        Admin
                                    </Link>
                                )}
                                {hasBusiness ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        <UserCircle size={18} />
                                        Profile
                                    </Link>
                                )}
                            </>
                        )}
                        {!token ? (
                            <Link
                                href="/login"
                                className="relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-sm transition-all duration-200 bg-white border border-transparent rounded-xl text-slate-700 hover:text-blue-600 before:absolute before:inset-0 before:rounded-xl before:border before:border-slate-200 hover:before:border-blue-400 hover:before:scale-105 before:transition-all active:scale-95"
                            >
                                <span className="relative">Login</span>
                            </Link>
                        ) : (
                            <button
                                onClick={logout}
                                className="group relative inline-flex items-center justify-center px-6 py-2.5 font-semibold text-sm transition-all duration-300 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            >
                                <span className="relative flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                    Logout
                                </span>
                            </button>
                        )}
                        <Link href={"#Howtodo"}>
                            <button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-200 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-blue-600 p-2"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden absolute w-full bg-white border-b border-blue-50 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 py-6' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="flex flex-col items-center space-y-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-slate-600 hover:text-blue-600 text-lg font-medium"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="flex flex-col w-full px-8 space-y-4 pt-4 border-t border-slate-50">
                        {token ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 text-violet-600 font-bold py-2 hover:bg-violet-50 rounded-xl"
                                    >
                                        <RiSettings5Line size={18} />
                                        Admin
                                    </Link>
                                )}
                                {hasBusiness ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold py-2 hover:bg-blue-50 rounded-xl"
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 text-slate-700 font-bold py-2 hover:bg-slate-50 rounded-xl"
                                    >
                                        <UserCircle size={18} />
                                        Profile
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-red-600 font-bold py-2 hover:bg-red-50 rounded-xl"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center text-slate-700 font-bold py-2 hover:bg-slate-50 rounded-xl"
                            >
                                Login
                            </Link>
                        )}
                        <Link href="#Howtodo" onClick={() => setIsOpen(false)}>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-xl font-bold shadow-md shadow-blue-100">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;