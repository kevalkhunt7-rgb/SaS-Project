"use client";

import React, { useState, useEffect } from "react";
import { 
  RiGroupLine, 
  RiBuilding4Line, 
  RiChatSmile2Line, 
  RiTicket2Line,
  RiArrowUpSLine,
  RiUserLine,
  RiUserFollowLine,
  RiShieldUserLine
} from "react-icons/ri";
import { adminApi } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Users", 
      value: stats?.totalUsers || 0, 
      icon: <RiGroupLine />, 
      color: "bg-blue-500",
      trend: stats?.growth?.users ? `+${stats.growth.users} new` : "0 new"
    },
    { 
      title: "Active Businesses", 
      value: stats?.totalBusinesses || 0, 
      icon: <RiBuilding4Line />, 
      color: "bg-violet-500",
      trend: stats?.growth?.businesses ? `+${stats.growth.businesses} new` : "0 new"
    },
    { 
      title: "Total Conversations", 
      value: stats?.totalConversations || 0, 
      icon: <RiChatSmile2Line />, 
      color: "bg-emerald-500",
      trend: stats?.growth?.conversations ? `+${stats.growth.conversations} new` : "0 new"
    },
  
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900">System Overview</h2>
        <p className="text-slate-500">Monitor your platform's performance and growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} p-3 rounded-2xl text-white shadow-lg`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                <RiArrowUpSLine />
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Platform Summary</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <RiGroupLine size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Total Users</p>
                        <p className="text-xs text-slate-500">Registered on platform</p>
                    </div>
                </div>
                <span className="text-lg font-black text-slate-900">{stats?.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                        <RiBuilding4Line size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Businesses</p>
                        <p className="text-xs text-slate-500">Active business accounts</p>
                    </div>
                </div>
                <span className="text-lg font-black text-slate-900">{stats?.totalBusinesses}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <RiChatSmile2Line size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Conversations</p>
                        <p className="text-xs text-slate-500">Total messages exchanged</p>
                    </div>
                </div>
                <span className="text-lg font-black text-slate-900">{stats?.totalConversations}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-violet-200 flex flex-col justify-center">
          <RiUserLine size={48} className="opacity-20 mb-6" />
          <h3 className="text-2xl font-black mb-4">Admin Control Center</h3>
          <p className="text-violet-100 leading-relaxed mb-8">
            You have full access to manage users, businesses, and platform settings. 
            Use the sidebar to navigate through different management sections.
          </p>
          <div className="flex gap-4">
            <Link href="/admin/users" className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
              Manage Users
            </Link>
            <Link href="/admin/businesses" className="bg-white text-violet-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-all">
              View Businesses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
