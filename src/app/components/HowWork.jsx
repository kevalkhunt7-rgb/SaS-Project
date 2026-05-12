"use client";

import React from 'react';
import { UserPlus, Code2, Database, Rocket, ArrowRight } from 'lucide-react';
import {useRouter} from "next/navigation"

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up in seconds and set up your business profile to get started with SupportAI.",
    icon: <UserPlus className="text-blue-600" size={24} />,
  },
  {
    number: "02",
    title: "Add chat widget",
    description: "Copy and paste a single line of code into your website to enable the chat interface.",
    icon: <Code2 className="text-violet-600" size={24} />,
  },
  {
    number: "03",
    title: "Upload your data",
    description: "Sync your website, PDFs, or help docs so the AI understands your unique business.",
    icon: <Database className="text-blue-600" size={24} />,
  },
  {
    number: "04",
    title: "AI starts replying",
    description: "Sit back while your AI assistant handles up to 80% of customer queries instantly.",
    icon: <Rocket className="text-violet-600" size={24} />,
  },
];

const HowItWorks = () => {

const router = useRouter();

  return (
    <section id="Howtodo" className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Process</h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-6">
            Get up and running in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">minutes.</span>
          </p>
          <p className="text-lg text-slate-600">
            No complex coding required. SupportAI is designed to integrate into your workflow seamlessly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-blue-100 -translate-y-16 z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 group">
              <div className="flex flex-col items-center text-center">
                
                {/* Number Badge & Icon Container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-blue-50 shadow-xl shadow-blue-100/50 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-200 transition-all duration-300">
                    {step.icon}
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white">
                    {step.number}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed px-4">
                  {step.description}
                </p>

                {/* Arrow (Mobile/Tablet spacer) */}
                {index !== steps.length - 1 && (
                  <div className="mt-8 lg:hidden text-blue-200">
                    <ArrowRight className="rotate-90 md:rotate-0" size={24} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <button onClick={()=>router.push('/profile')} className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-200 text-slate-900 px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:shadow-blue-50 active:scale-95">
            Start your journey <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;