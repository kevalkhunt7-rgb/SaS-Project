"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI chatbot work?",
    answer: "SupportAI uses advanced large language models (like GPT-4) to understand customer intent. It scans your provided business data to give accurate, human-like responses to questions 24/7 without needing a manual script."
  },
  {
    question: "Can I train it with my own business data?",
    answer: "Absolutely. You can upload PDFs, text files, or simply provide your website URL. Our system will 'crawl' and index your information, ensuring the AI only speaks about your specific products and services."
  },
  {
    question: "Can I add it to my website?",
    answer: "Yes! We provide a single line of JavaScript code. You just copy and paste it into your website's header or footer, and the chat widget will appear instantly on all your pages."
  },
  {
    question: "Does it support WhatsApp?",
    answer: "Yes, our Pro and Enterprise plans include a native WhatsApp Business API integration. This allows your AI to respond to customers on their favorite messaging app as easily as on your website."
  },
  {
    question: "Is real-time human chat available?",
    answer: "Yes. If the AI encounters a complex query it can't solve, it can automatically notify your team. You can take over the conversation at any time through our centralized Admin Dashboard."
  },
  {
    question: "Is it suitable for small businesses?",
    answer: "It's built specifically for them! Most small businesses don't have 24/7 support teams. SupportAI fills that gap, providing enterprise-level service at a fraction of the cost of hiring additional staff."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-50/30 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-blue-100 text-blue-600 shadow-sm mb-6">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Commonly Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Questions</span>
          </h2>
          <p className="text-slate-600">
            Everything you need to know about setting up your AI support.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index 
                ? 'bg-white border-blue-200 shadow-xl shadow-blue-100/50' 
                : 'bg-white/50 border-slate-100 hover:border-blue-100'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-lg transition-colors ${
                  openIndex === index ? 'text-blue-600' : 'text-slate-900'
                }`}>
                  {faq.question}
                </span>
                <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
                  <ChevronDown size={20} />
                </div>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-blue-50/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircleQuestion size={24} />
            </div>
            <div>
              <p className="font-bold">Still have questions?</p>
              <p className="text-blue-100 text-sm">We're here to help you get started.</p>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
            Contact Support
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;