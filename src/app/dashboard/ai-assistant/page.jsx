"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  RiRobot3Fill, 
  RiSendPlane2Fill, 
  RiUser3Line, 
  RiInformationLine, 
  RiSparklingFill,
  RiFlashlightLine,
  RiQuestionnaireLine,
  RiShieldFlashLine
} from "react-icons/ri";
import { aiApi, businessApi } from "@/lib/api";

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your SupportAI Business Assistant. I've analyzed your latest business metrics. How can I help you optimize your operations today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [business, setBusiness] = useState(null);
  const scrollRef = useRef(null);

  // Suggestions for the user
  const suggestions = [
    { label: "Summarize tickets", icon: <RiFlashlightLine /> },
    { label: "Improve KB articles", icon: <RiQuestionnaireLine /> },
    { label: "Security audit", icon: <RiShieldFlashLine /> },
  ];

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await businessApi.getMyBusiness();
        if (res.data?.success) setBusiness(res.data.business);
      } catch (error) {
        console.error("Error fetching business:", error);
      }
    };
    fetchBusiness();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e, customInput) => {
    if (e) e.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim() || !business) return;

    const userMessage = {
      role: "user",
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await aiApi.businessAssistant({
        message: messageText,
        businessId: business._id
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.aiReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered a connection glitch. Let's try that again.", time: "System" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-[#fcfcfd] rounded-[2rem] border border-slate-200/60 shadow-xl shadow-blue-900/5 overflow-hidden relative">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-100 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
              <RiRobot3Fill />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Business Intelligence</h1>
            <p className="text-[11px] text-blue-600 font-heavy uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">
              <RiSparklingFill className="animate-pulse" />
              Agent Active
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-xs font-semibold text-slate-600 italic">
                    {business?.businessName || "General"} Context Loaded
                </span>
            </div>
        </div>
      </header>

      {/* Chat Space */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 z-10" ref={scrollRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-4 duration-500"}`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-lg mt-1 ${
                msg.role === "user" ? "bg-slate-200 text-slate-500" : "bg-blue-50 text-blue-600 border border-blue-100"
              }`}>
                {msg.role === "user" ? <RiUser3Line /> : <RiRobot3Fill />}
              </div>
              
              <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-5 py-3.5 rounded-[1.5rem] shadow-sm leading-relaxed text-[15px] ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2 px-1 uppercase tracking-tighter">
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
             <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                <RiRobot3Fill />
             </div>
             <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <footer className="p-6 bg-white border-t border-slate-100 z-20">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Suggestion Chips */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
               {suggestions.map((s) => (
                 <button 
                  key={s.label}
                  onClick={() => handleSendMessage(null, s.label)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 transition-all active:scale-95"
                 >
                   <span className="text-blue-500">{s.icon}</span>
                   {s.label}
                 </button>
               ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message Business AI...`}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-5 pr-16 text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-blue-200 active:scale-90"
            >
              <RiSendPlane2Fill size={20} />
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><RiShieldFlashLine className="text-emerald-500" /> Secure Data</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>LLM: SupportAI-V2-Turbo</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIAssistantPage;