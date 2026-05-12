"use client";

import React, { useState, useEffect } from "react";
import { 
  RiSettings4Line, 
  RiGlobalLine, 
  RiPaletteLine, 
  RiShieldLine,
  RiSaveLine,
  RiBuildingLine,
  RiPencilFill,
  RiLoader4Line
} from "react-icons/ri";
import { businessApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const [business, setBusiness] = useState({
    businessName: "",
    slug: "",
    brandColor: "#2563eb",
    logo: { url: "" }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await businessApi.getMyBusiness();
        if (res.data.success) {
          setBusiness(res.data.business);
        }
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await businessApi.update({
        businessName: business.businessName,
        brandColor: business.brandColor
      });
      if (res.data.success) {
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);
    setUploading(true);

    try {
      const res = await businessApi.update(formData);
      if (res.data.success) {
        setBusiness({ ...business, logo: res.data.business.logo });
        toast.success("Logo updated successfully!");
        // Optional: Trigger a navbar refresh if needed
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Error uploading logo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-slate-100 rounded-[2.5rem]" />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your business and widget</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <RiSaveLine size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Business Profile */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <RiBuildingLine className="text-blue-600" size={24} />
            <h2 className="text-xl font-black text-slate-900">Business Profile</h2>
          </div>

          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <div className="relative group/logo">
              <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                {uploading ? (
                  <RiLoader4Line className="animate-spin text-blue-600" size={32} />
                ) : business.logo?.url ? (
                  <img src={business.logo.url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <RiBuildingLine className="text-slate-200" size={40} />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all">
                <RiPencilFill size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{business.businessName} Logo</h3>
              <p className="text-sm text-slate-500 mt-1">Upload a high-quality logo of your brand</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Name</label>
              <input 
                type="text" 
                value={business.businessName}
                onChange={(e) => setBusiness({...business, businessName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Public Slug</label>
              <input 
                type="text" 
                value={business.slug}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-slate-500 outline-none font-medium cursor-not-allowed"
              />
            </div>
          </div>

         
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
