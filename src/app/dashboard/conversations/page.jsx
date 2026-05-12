"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  RiChat3Line, 
  RiUserLine, 
  RiTimeLine,
  RiArrowRightSLine,
  RiCheckDoubleLine,
  RiSearchLine,
  RiArrowLeftLine,
  RiSendPlane2Line,
  RiRobotLine
} from "react-icons/ri";
import { conversationApi, messageApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await conversationApi.getBusinessConversations();
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conv) => {
    setSelectedConversation(conv);
    setLoadingMessages(true);
    try {
      const res = await messageApi.getByConversation(conv._id);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 h-[calc(100vh-12rem)]">
      {!selectedConversation ? (
        <>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Conversations</h1>
            <p className="text-slate-500 font-medium mt-1">Manage customer interactions</p>
          </div>

          <div className="relative max-w-md">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-y-auto max-h-[calc(100vh-25rem)]">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {filteredConversations.map((conv) => (
                  <div 
                    key={conv._id} 
                    onClick={() => fetchMessages(conv)}
                    className="p-6 hover:bg-slate-50 transition-all flex items-center gap-6 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-black">
                      {conv.customerName.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 truncate">{conv.customerName}</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate font-medium">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${conv.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {conv.status}
                      </div>
                      <RiArrowRightSLine className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <RiChat3Line size={48} className="mx-auto text-slate-100 mb-4" />
                <h3 className="text-xl font-black text-slate-900">No conversations found</h3>
                <p className="text-slate-500 font-medium">Customer chats will appear here</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex items-center gap-4">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
            >
              <RiArrowLeftLine size={24} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black shrink-0">
              {selectedConversation.customerName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{selectedConversation.customerName}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                {selectedConversation.status}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            {loadingMessages ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'customer' ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${msg.sender === 'customer' ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'}`}>
                      {msg.sender === 'customer' ? <RiUserLine /> : <RiRobotLine />}
                    </div>
                    <div className={`p-4 rounded-2xl ${msg.sender === 'customer' ? 'bg-slate-50 text-slate-900 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                      <p className={`text-[9px] mt-1 font-bold uppercase opacity-50 ${msg.sender === 'customer' ? 'text-slate-400' : 'text-blue-100'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">No messages in this conversation.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
