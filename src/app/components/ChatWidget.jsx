"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageCircle, Sparkles } from 'lucide-react';
import { publicApi, aiApi } from '@/lib/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: "Hi there! 👋 I'm the SupportAI demo bot. You can ask me about our platform, pricing, or how to get started!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Load business info on mount (using a demo slug for the landing page)
  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const res = await publicApi.getBusinessBySlug('demo-business');
        if (res.data.success) {
          setBusinessInfo(res.data.business);
        }
      } catch (error) {
        console.error("Error loading business info:", error);
      }
    };
    loadBusiness();
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = inputMessage;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: Date.now(),
      type: 'customer',
      message: userMessage,
      time,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let currentConvId = conversationId;

      // 1. Start conversation if not started
      if (!currentConvId) {
        console.log("Starting new conversation...");
        const startRes = await publicApi.startChat({
          businessSlug: 'demo-business',
          customerName: 'Guest'
        });
        
        if (startRes.data.success) {
          currentConvId = startRes.data.conversation._id;
          setConversationId(currentConvId);
          console.log("Conversation started:", currentConvId);
        } else {
          throw new Error(startRes.data.message || "Failed to start conversation");
        }
      }

      if (!currentConvId) {
        throw new Error("No conversation ID available");
      }

      // 2. Send customer message
      console.log("Sending message...");
      await publicApi.sendChatMessage({
        conversationId: currentConvId,
        message: userMessage
      });

      // 3. Get AI Reply
      console.log("Fetching AI reply...");
      const aiRes = await aiApi.reply({
        conversationId: currentConvId,
        customerQuestion: userMessage
      });

      if (aiRes.data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          message: aiRes.data.aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      } else {
        throw new Error(aiRes.data.message || "Failed to get AI reply");
      }
    } catch (error) {
      console.error("Chat Widget Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Connection error";
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        message: `I'm having a little trouble connecting (${errorMessage}). Please try again in a moment!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl border border-blue-50 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <Sparkles size={20} />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-600"></div>
              </div>
              <div>
                <h4 className="font-bold text-sm">SupportAI Assistant</h4>
                <p className="text-blue-100 text-[10px] flex items-center gap-1">
                  <Bot size={10} /> Online | Replies instantly
                </p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/50 scroll-smooth"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.type === 'ai' 
                    ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  {msg.message}
                  <div className={`text-[10px] mt-1 opacity-70 ${msg.type === 'customer' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..." 
              className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Footer Branding */}
          <div className="pb-2 text-center bg-white">
            <span className="text-[10px] text-slate-400">Powered by <b className="text-blue-600">SupportAI</b></span>
          </div>
        </div>
      )}

      {/* Toggle Button (Floating Bubble) */}
      <button 
        onClick={toggleChat}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen 
          ? 'bg-white text-slate-500 rotate-90 border border-slate-100' 
          : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-105'
        }`}
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <MessageCircle size={30} />
            {/* Notification Badge */}
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;