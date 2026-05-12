"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RiBuildingLine,
  RiMailLine,
  RiPhoneLine,
  RiGlobalLine,
  RiFileTextLine,
  RiBriefcaseLine,
  RiArrowRightLine
} from "react-icons/ri";
import { businessApi } from "@/lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Fotter";

const ProfilePage = () => {
  const router = useRouter();
  const [hasBusiness, setHasBusiness] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    description: "",
    supportEmail: "",
    phone: "",
    website: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    checkBusiness();
  }, [router]);

  const checkBusiness = async () => {
    try {
      const res = await businessApi.getMyBusiness();
      if (res.data.success) {
        setHasBusiness(true);
        router.push("/dashboard");
      }
    } catch (error) {
      setHasBusiness(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await businessApi.create(formData);
      if (res.data.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error creating business");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Info */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-violet-700 p-12 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 border border-white/30 backdrop-blur-sm">
                  <RiBuildingLine size={32} />
                </div>
                <h1 className="text-3xl font-black mb-4 leading-tight">Create Your Business Profile</h1>
                <p className="text-blue-100 font-medium leading-relaxed">
                  Set up your business identity to start training your AI assistant and managing customer conversations.
                </p>
                
                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">1</div>
                    Enter business details
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">2</div>
                    Customize your widget
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">3</div>
                    Go live instantly
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:w-2/3 p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Business Name</label>
                      <div className="relative group">
                        <RiBuildingLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Acme Corp"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Industry</label>
                      <div className="relative group">
                        <RiBriefcaseLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Technology"
                          value={formData.industry}
                          onChange={(e) => setFormData({...formData, industry: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Description</label>
                    <div className="relative group">
                      <RiFileTextLine className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <textarea 
                        required
                        rows={4}
                        placeholder="Tell us about your business..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Support Email</label>
                      <div className="relative group">
                        <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          required
                          type="email" 
                          placeholder="support@acme.com"
                          value={formData.supportEmail}
                          onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative group">
                        <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Website URL</label>
                    <div className="relative group">
                      <RiGlobalLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="url" 
                        placeholder="https://acme.com"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={creating}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {creating ? "Creating Business..." : (
                      <>
                        Create Business
                        <RiArrowRightLine size={20} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
