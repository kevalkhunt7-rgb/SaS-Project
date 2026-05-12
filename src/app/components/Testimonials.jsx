"use client";

import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Owner, Bloom & Wild Florals",
    text: "SupportAI has been a game-changer for my flower shop. It handles basic delivery questions perfectly, allowing me to focus on creating arrangements. My customers love the instant replies!",
    rating: 5,
    initials: "SJ",
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "Marcus Chen",
    role: "Founder, TechFix Solutions",
    text: "I was skeptical about AI, but after training it on our internal documentation, it now resolves 60% of our technical queries without human intervention. The ROI was immediate.",
    rating: 5,
    initials: "MC",
    color: "bg-violet-100 text-violet-600"
  },
  {
    name: "Elena Rodriguez",
    role: "Manager, Urban Stay Rentals",
    text: "Managing guest inquiries across different time zones used to be a nightmare. Now, SupportAI handles late-night check-in questions 24/7. It’s like having a full-time employee for a fraction of the cost.",
    rating: 5,
    initials: "ER",
    color: "bg-blue-100 text-blue-600"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-50/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-50/30 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Testimonials</h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-6">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">small businesses</span> worldwide.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
            <span className="text-sm ml-2">Joined by 500+ business owners this month</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-blue-500 text-blue-500" />
                  ))}
                </div>

                {/* Quote Icon Decoration */}
                <Quote className="absolute top-8 right-8 text-slate-100 group-hover:text-blue-50 transition-colors" size={48} />

                <p className="text-slate-600 leading-relaxed mb-8 relative z-10 italic">
                  "{t.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <CheckCircle size={14} className="text-blue-500" />
                  </div>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Logos Placeholder */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           <span className="font-black text-xl text-slate-400">FLORISTLY</span>
           <span className="font-black text-xl text-slate-400">TECHPRO</span>
           <span className="font-black text-xl text-slate-400">HOSTLY</span>
           <span className="font-black text-xl text-slate-400">RETAILGO</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;