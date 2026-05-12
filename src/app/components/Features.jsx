"use client";

import React from 'react';
import { 
  MessageSquareQuote, 
  Layout, 
  Zap, 
  BarChart3, 
  Database, 
  MessageCircle 
} from 'lucide-react';

const features = [
  {
    title: "AI Auto Replies",
    description: "Instantly resolve common queries with GPT-4 powered responses tailored to your brand voice.",
    icon: <Zap className="text-blue-600" size={24} />,
  },
  {
    title: "Website Chat Widget",
    description: "A beautiful, customizable widget that blends seamlessly with your existing website design.",
    icon: <MessageSquareQuote className="text-violet-600" size={24} />,
  },
  {
    title: "Real-time Chat",
    description: "Seamlessly transition from AI to human agents whenever a personal touch is required.",
    icon: <Layout className="text-blue-600" size={24} />,
  },
  {
    title: "Admin Dashboard",
    description: "Track performance, monitor conversation volume, and manage your team from one clean interface.",
    icon: <BarChart3 className="text-violet-600" size={24} />,
  },
  {
    title: "Train AI with Data",
    description: "Upload PDFs or link your URL to train the AI on your specific business knowledge in seconds.",
    icon: <Database className="text-blue-600" size={24} />,
  },
  {
    title: "WhatsApp Integration",
    description: "Extend your support to the world's most popular messaging app with our native integration.",
    icon: <MessageCircle className="text-violet-600" size={24} />,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className=" -mt-10 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm">Features</h2>
          <p className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">scale support.</span>
          </p>
          <p className="text-lg text-slate-600">
            Powerful tools designed for small businesses to provide enterprise-grade customer service without the enterprise price tag.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;