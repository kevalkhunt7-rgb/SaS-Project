"use client";

import React, { useState, useEffect } from "react";
import { RiCheckLine, RiShieldStarLine, RiVipCrownLine, RiRocketLine, RiInformationLine, RiFlashlightLine } from "react-icons/ri";
import { subscriptionApi } from "@/lib/api";
import { useRouter } from "next/navigation"; // Added for redirection
import toast from "react-hot-toast";

const PricingSection = () => {
    const router = useRouter(); // Initialize router
    const [subscription, setSubscription] = useState(null);
    const [plans, setPlans] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        loadRazorpayScript();
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, plansRes] = await Promise.all([
                subscriptionApi.getCurrent(),
                subscriptionApi.getPlans()
            ]);
            setSubscription(subRes.data.subscription);
            setPlans(plansRes.data.plans);
        } catch (error) {
            toast.error("Failed to load subscription data");
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    };

    const handleUpgrade = async (planName) => {
        // Check if user has a business before allowing upgrade
        if (!subscription || (subscription.usage?.businessesUsed || 0) === 0) {
            toast.error("Please create a business account first to upgrade your plan.");
            router.push("/profile");
            return;
        }

        const loadingToast = toast.loading(`Initiating upgrade to ${planName}...`);
        try {
            const orderRes = await subscriptionApi.createOrder(planName);
            const { order, key_id } = orderRes.data;

            const options = {
                key: key_id,
                amount: order.amount,
                currency: "INR",
                name: "SupportAI",
                description: `Upgrade to ${planName} Plan`,
                order_id: order.id,
                handler: async (response) => {
                    const verifyToast = toast.loading("Verifying payment...");
                    try {
                        await subscriptionApi.verifyPayment({
                            ...response,
                            planName
                        });
                        toast.success(`Successfully upgraded to ${planName}!`, { id: verifyToast });
                        fetchData();
                    } catch (error) {
                        toast.error("Payment verification failed", { id: verifyToast });
                    }
                },
                prefill: { name: "", email: "" },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            toast.dismiss(loadingToast);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to initiate payment", { id: loadingToast });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium animate-pulse">Loading your experience...</p>
            </div>
        );
    }

    const planCards = [
        {
            name: "Free",
            price: "₹0",
            icon: <RiRocketLine />,
            features: ["1 Business", "10 Knowledge Entries", "100 Chats/month", "50 AI Replies/month", "1 Team Member"],
            color: "blue",
            accent: "from-blue-500 to-cyan-500"
        },
        {
            name: "Pro",
            price: "₹1499",
            icon: <RiShieldStarLine />,
            features: ["5 Businesses", "500 Knowledge Entries", "5000 Chats/month", "3000 AI Replies/month", "5 Team Members"],
            color: "violet",
            popular: true,
            accent: "from-violet-600 to-indigo-600"
        },
        {
            name: "Enterprise",
            price: "₹2999",
            icon: <RiVipCrownLine />,
            features: ["Unlimited Businesses", "Unlimited Knowledge", "Unlimited Chats", "Unlimited AI Replies", "Unlimited Team Members"],
            color: "amber",
            accent: "from-amber-500 to-orange-600"
        }
    ];

    return (
        <div id={'#pricing'} className="max-w-7xl mx-auto px-4 py-8 space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6 relative">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-wide uppercase">
                    <RiFlashlightLine /> Pricing & Billing
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                    Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">AI Support</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Choose the perfect plan to empower your team and provide world-class automated support to your customers.
                </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {planCards.map((plan) => {
                    const isCurrent = subscription?.plan === plan.name;
                    return (
                        <div key={plan.name} className={`relative flex flex-col rounded-[3rem] p-1 transition-all duration-500 hover:-translate-y-2
                            ${isCurrent ? `bg-gradient-to-b ${plan.accent} shadow-2xl` : 'bg-slate-200 hover:bg-slate-300'}
                        `}>
                            <div className="bg-white rounded-[2.9rem] p-8 flex-grow flex flex-col">
                                {plan.popular && (
                                    <div className="absolute top-8 right-8">
                                        <span className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-black py-1.5 px-4 rounded-full uppercase tracking-tighter shadow-lg">
                                            Recommended
                                        </span>
                                    </div>
                                )}
                                
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg bg-gradient-to-br ${plan.accent}`}>
                                    {React.cloneElement(plan.icon, { size: 28 })}
                                </div>
                                
                                <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2 mb-8">
                                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-slate-400 font-bold text-lg">/mo</span>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600 leading-tight">
                                            <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:text-blue-500`}>
                                                <RiCheckLine size={14} className={isCurrent ? "text-blue-600" : ""} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    disabled={isCurrent}
                                    onClick={() => handleUpgrade(plan.name)}
                                    className={`w-full py-4 rounded-2xl font-black transition-all transform active:scale-95
                                        ${isCurrent 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-dashed border-slate-200' 
                                            : `bg-slate-900 text-white hover:bg-black hover:shadow-xl shadow-slate-200`}
                                    `}
                                >
                                    {isCurrent ? 'Current Plan' : plan.name === 'Free' ? 'Current Free Plan' : `Get Started with ${plan.name}`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="max-w-3xl mx-auto bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <RiInformationLine className="text-blue-600" size={24} />
                </div>
                <div className="space-y-1">
                    <p className="font-black text-slate-900">Billing Transparency</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Subscriptions are billed monthly. Need custom limits? 
                        <span className="text-blue-600 font-bold cursor-pointer hover:underline ml-1">Contact Enterprise Sales</span>.
                        All plans include 256-bit SSL encryption and daily backups.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingSection;