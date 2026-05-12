"use client";

import React, { useState, useEffect } from "react";
import { 
  RiSearchLine, 
  RiFilter3Line, 
  RiMore2Fill,
  RiBuilding4Line,
  RiExternalLinkLine,
  RiUserLine,
  RiDeleteBin6Line,
  RiInformationLine
} from "react-icons/ri";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

const BusinessDirectory = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await adminApi.getBusinesses();
      if (res.data.success) {
        setBusinesses(res.data.businesses);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    (b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.slug?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteBusiness = async (bizId) => {
    if (window.confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      const loadingToast = toast.loading("Deleting business...");
      try {
        const res = await adminApi.deleteBusiness(bizId);
        if (res.data.success) {
          toast.success("Business deleted successfully", { id: loadingToast });
          fetchBusinesses();
        }
      } catch (error) {
        console.error("Error deleting business:", error);
        toast.error(error.response?.data?.message || "Failed to delete business", { id: loadingToast });
      }
    }
  };

  const showBusinessDetails = (biz) => {
    setSelectedBusiness(biz);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Business Directory</h2>
          <p className="text-slate-500">Overview of all businesses registered on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search businesses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all w-full md:w-64"
            />
          </div>
          <button className="bg-white border border-slate-200 p-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
            <RiFilter3Line size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Business</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Owner</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBusinesses.map((biz) => (
                <tr key={biz._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {biz.logo?.url ? (
                        <img src={biz.logo.url} alt={biz.businessName} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                          <RiBuilding4Line size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{biz.businessName}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          /{biz.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                        {biz.owner?.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{biz.owner?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                      {biz.plan || "Free"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-bold text-emerald-600">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => showBusinessDetails(biz)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <RiInformationLine size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteBusiness(biz._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Business"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <RiMore2Fill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Details Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-br from-blue-600 to-violet-700 p-8 text-white relative">
              <button 
                onClick={() => setSelectedBusiness(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <RiMore2Fill className="rotate-90" />
              </button>
              
              <div className="flex items-center gap-6">
                {selectedBusiness.logo?.url ? (
                  <img src={selectedBusiness.logo.url} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <RiBuilding4Line size={40} />
                  </div>
                )}
                <div>
                  <h3 className="text-3xl font-black">{selectedBusiness.businessName}</h3>
                  <p className="text-blue-100 font-medium">/{selectedBusiness.slug}</p>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Business Info</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">Industry</p>
                    <p className="font-bold text-slate-900">{selectedBusiness.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Support Email</p>
                    <p className="font-bold text-slate-900">{selectedBusiness.supportEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Website</p>
                    <p className="font-bold text-slate-900">{selectedBusiness.website || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Platform Stats</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">Current Plan</p>
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-bold">{selectedBusiness.plan}</span>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="font-bold text-slate-900">{selectedBusiness.owner?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedBusiness(null)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDirectory;
