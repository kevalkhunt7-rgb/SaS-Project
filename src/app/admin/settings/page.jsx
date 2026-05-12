"use client";

import React from "react";
import { 
  RiSettings5Line, 
  RiGlobalLine, 
  RiNotification3Line, 
  RiShieldLine,
  RiDatabase2Line,
  RiSaveLine
} from "react-icons/ri";
import toast from "react-hot-toast";

const SystemSettings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleBackup = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Backing up system...',
        success: 'Backup completed successfully!',
        error: 'Backup failed.',
      }
    );
  };
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900">System Settings</h2>
        <p className="text-slate-500">Configure global platform parameters and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Settings */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <RiGlobalLine size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">General Configuration</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Platform Name</label>
                  <input type="text" defaultValue="SupportAI" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                  <input type="email" defaultValue="admin@supportai.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Default Business Plan</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                  <option>Free</option>
                  <option>Basic</option>
                  <option>Pro</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <RiShieldLine size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Security & Access</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-900">New User Registration</p>
                  <p className="text-xs text-slate-500">Allow new users to create accounts.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Enforce 2FA for all admin accounts.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Quick Info */}
          <section className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-violet-200">
            <RiDatabase2Line size={40} className="opacity-20 mb-4" />
            <h3 className="text-xl font-bold mb-2">System Status</h3>
            <p className="text-violet-100 text-sm mb-6">Everything is running smoothly. Last backup was completed 4 hours ago.</p>
            <button 
              onClick={handleBackup}
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 py-3 rounded-2xl font-bold text-sm hover:bg-white/30 transition-all"
            >
              Run Manual Backup
            </button>
          </section>

          <button 
            onClick={handleSave}
            className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
          >
            <RiSaveLine size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
