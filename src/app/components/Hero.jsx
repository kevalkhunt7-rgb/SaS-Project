"use client";

import React from 'react';
import { Play, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import {useRouter} from "next/navigation";

const HeroSection = () => {

  const router = useRouter();

  return (
    <section className="relative -mt-22 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden ">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-violet-100/40 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium animate-fade-in">
              <Sparkles size={16} />
              <span>Next-Gen AI Support for Small Business</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              AI Customer Support <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                That Works 24/7
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Automate up to 80% of your support replies instantly. Reduce costs and increase customer satisfaction with a chatbot that thinks like a human but works like a machine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={()=>router.push('/')} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-slate-200 active:scale-95">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-200 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-blue-50/50">
                <Play size={20} className="fill-current" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={18} className="text-green-500" /> No Credit Card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={18} className="text-green-500" /> 14-Day Trial
              </div>
            </div>
          </div>

          {/* Right Content: Chat Mockup */}
          <div className="relative group">
            {/* Soft Glow behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            
            <div className="relative bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
              {/* Mockup Header */}
              <div className="bg-slate-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">AI</div>
                  <div>
                    <p className="text-white text-xs font-bold">SupportAI Bot</p>
                    <p className="text-blue-300 text-[10px]">Active now</p>
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="p-6 space-y-4 bg-slate-50/50 min-h-[300px]">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[80%] text-sm text-slate-700">
                  Hi there! How can I help your business scale today?
                </div>
                <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none shadow-sm ml-auto max-w-[80%] text-sm text-white">
                  Can you explain your pricing plans for small teams?
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%] text-sm text-slate-700 flex gap-2">
                  <div className="w-5 h-5 mt-1 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-[8px] text-white">AI</div>
                  <div>
                    Absolutely! We have a "Growth" plan at $49/mo that includes 2,000 automated resolutions and 24/7 coverage. Would you like a breakdown?
                  </div>
                </div>
              </div>

              {/* Mockup Input */}
              <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs text-slate-400 flex items-center">
                  Type a message...
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Send size={14} />
                </div>
              </div>
            </div>

            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce transition-all duration-[3000ms]">
              <p className="text-xs font-bold text-slate-900">Reduced Support Cost</p>
              <p className="text-lg font-black text-blue-600">-65%</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;