"use client";

import React, { useState, useEffect } from "react";
import { 
  RiTicketLine, 
  RiSearchLine,
  RiFilterLine,
  RiMore2Line,
  RiArrowRightUpLine,
  RiCheckFill,
  RiTimeLine,
  RiCloseFill
} from "react-icons/ri";
import { ticketApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await ticketApi.getBusinessTickets();
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await ticketApi.updateStatus(id, newStatus);
      if (res.data.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-600';
      case 'medium': return 'bg-orange-50 text-orange-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-50 text-green-600';
      case 'in progress': return 'bg-blue-50 text-blue-600';
      case 'open': return 'bg-violet-50 text-violet-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tickets</h1>
          <p className="text-slate-500 font-medium mt-1">Track and resolve customer issues</p>
        </div>
        <button className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <RiFilterLine size={20} />
          Filters
        </button>
      </div>

      <div className="relative max-w-md">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search tickets..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Subject</th>
              <th className="px-8 py-6">Priority</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1,2,3,4].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-6"><div className="h-8 bg-slate-100 rounded-xl w-full" /></td>
                </tr>
              ))
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">
                        {ticket.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{ticket.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{ticket.customerEmail || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{ticket.subject}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {ticket.status.toLowerCase() === 'resolved' ? (
                        <button 
                          onClick={() => handleStatusUpdate(ticket._id, "open")}
                          disabled={updatingId === ticket._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-100 transition-all disabled:opacity-50"
                        >
                          <RiTimeLine size={14} />
                          Reopen
                        </button>
                      ) : (
                        <>
                          {ticket.status.toLowerCase() !== 'in progress' && (
                            <button 
                              onClick={() => handleStatusUpdate(ticket._id, "in progress")}
                              disabled={updatingId === ticket._id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-100 transition-all disabled:opacity-50"
                            >
                              <RiTimeLine size={14} />
                              In Progress
                            </button>
                          )}
                          <button 
                            onClick={() => handleStatusUpdate(ticket._id, "resolved")}
                            disabled={updatingId === ticket._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase hover:bg-green-100 transition-all disabled:opacity-50"
                          >
                            <RiCheckFill size={14} />
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <RiTicketLine size={48} className="mx-auto text-slate-100 mb-4" />
                  <h3 className="text-xl font-black text-slate-900">No tickets found</h3>
                  <p className="text-slate-500 font-medium">Support requests will appear here</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsPage;
