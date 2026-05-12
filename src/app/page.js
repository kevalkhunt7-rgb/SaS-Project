import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturesSection from './components/Features'
import ChatWidgetPreview from './components/ChatWidget'
import HowItWorks from './components/HowWork'
import PricingSection from './components/Subscription'
import Testimonials from './components/Testimonials'
import FAQSection from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Fotter'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Global Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50 bg-glow animate-float" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-violet-50 bg-glow animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      
      <main>
        <Hero />
        
        {/* Trusted By Section (Simple Row) */}
       
        <FeaturesSection />
        
       
        
        <HowItWorks />
        
        <ChatWidgetPreview />
        
        <Testimonials />
        
        <PricingSection />
        
        <FAQSection />
        
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage;