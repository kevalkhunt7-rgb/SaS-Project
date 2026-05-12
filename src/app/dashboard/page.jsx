"use client";

import React, { useState, useEffect } from "react";
import { 
  RiChat3Line, 
  RiTicketLine, 
  RiRobotLine, 
  RiUserVoiceLine,
  RiArrowUpLine,
  RiArrowDownLine
} from "react-icons/ri";
import { dashboardApi } from "@/lib/api";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalTickets: 0,
    totalMessages: 0,
    aiRepliesCount: 0,
    customerMessagesCount: 0,
    openTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: "Total Conversations", 
      value: stats.totalConversations, 
      icon: <RiChat3Line />, 
      color: "bg-blue-500",
      trend: "+12%", 
      isUp: true 
    },
    { 
      label: "Open Tickets", 
      value: stats.openTickets, 
      icon: <RiTicketLine />, 
      color: "bg-violet-500",
      trend: "-5%", 
      isUp: false 
    },
    { 
      label: "AI Resolutions", 
      value: stats.aiRepliesCount, 
      icon: <RiRobotLine />, 
      color: "bg-emerald-500",
      trend: "+18%", 
      isUp: true 
    },
    { 
      label: "Customer Messages", 
      value: stats.customerMessagesCount, 
      icon: <RiUserVoiceLine />, 
      color: "bg-orange-500",
      trend: "+24%", 
      isUp: true 
    },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl" />)}
      </div>
      <div className="h-96 bg-slate-200 rounded-3xl" />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 font-medium mt-1">Real-time performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} p-3 rounded-2xl text-white text-xl shadow-lg`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                {card.isUp ? <RiArrowUpLine /> : <RiArrowDownLine />}
                {card.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</h3>
            <p className="text-3xl font-black text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">Conversation Trends</h2>
          <div className="h-64 flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
            Chart integration coming soon
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <RiChat3Line />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">New conversation started</p>
                  <p className="text-xs text-slate-500 font-medium">Customer #1293 • 2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
