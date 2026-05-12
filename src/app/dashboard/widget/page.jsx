"use client";

import React, { useState, useEffect } from "react";
import {
  RiGlobalLine,
  RiPaletteLine,
  RiCodeSSlashLine,
  RiCheckFill,
  RiFileCopyLine,
  RiInformationLine,
  RiSendPlane2Line,
  RiLayoutRightLine,
  RiLayoutLeftLine,
  RiSaveLine,
  RiLoader4Line,
} from "react-icons/ri";
import { businessApi, knowledgeApi } from "@/lib/api";
import { toast } from "react-hot-toast";

// ─── SVG Avatar Definitions ───────────────────────────────────────────────────
const AVATARS = [
  {
    id: "avt1",
    label: "Avatar 1",
    image: "/Avt1.svg",
  },
  {
    id: "avt2",
    label: "Avatar 2",
    image: "/Avt2.svg",
  },
  {
    id: "avt3",
    label: "Avatar 3",
    image: "/Avt3.svg",
  },
  {
    id: "avt4",
    label: "Avatar 4",
    image: "/Avt4.svg",
  },
  {
    id: "avt5",
    label: "Avatar 5",
    image: "/Avt5.svg",
  },
];
// ─── Avatar Picker ────────────────────────────────────────────────────────────
const AvatarPicker = ({ selectedId, color, onChange }) => (
  <div className="space-y-3">
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
      Bot Avatar
    </label>
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((av) => {
        const isSelected = selectedId === av.id;
        return (
          <button
            key={av.id}
            onClick={() => onChange(av.id)}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${isSelected
              ? "border-gray-900 bg-white shadow-lg scale-[1.04]"
              : "border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white hover:scale-[1.02]"
              }`}
          >
            {isSelected && (
              <div
                className="absolute inset-0 opacity-[0.06] rounded-2xl"
                style={{ backgroundColor: color }}
              />
            )}
            <div className="w-11 h-11 relative z-10 drop-shadow-sm">
              <img
                src={av.image}
                alt={av.label}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className={`text-[10px] font-bold tracking-wide relative z-10 ${isSelected ? "text-gray-900" : "text-gray-400"}`}>
              {av.label}
            </span>
            {isSelected && (
              <div
                className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center z-10 shadow-sm"
                style={{ backgroundColor: color }}
              >
                <RiCheckFill size={8} className="text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Reusable Avatar renderer ─────────────────────────────────────────────────
const AvatarDisplay = ({ avatarId, size = "md" }) => {
  const av = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];

  const cls = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size];

  return (
    <div className={cls}>
      <img
        src={av.image}
        alt={av.label}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const WidgetPage = () => {
  const [business, setBusiness] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("customize");

  const [settings, setSettings] = useState({
    title: "SupportAI Assistant",
    welcomeMessage: "Hi! How can I help you today?",
    color: "#2563eb",
    widgetPosition: "bottom-right",
    widgetEnabled: true,
    widgetAvatar: "bot",
  });

  useEffect(() => { fetchBusiness(); }, []);

  const fetchBusiness = async () => {
    try {
      const res = await businessApi.getMyBusiness();
      if (res.data.success) {
        setBusiness(res.data.business);
        if (res.data.business.widgetSettings) {
          const ws = res.data.business.widgetSettings;
          setSettings({
            title: ws.title || "SupportAI Assistant",
            welcomeMessage: ws.welcomeMessage || "Hi! How can I help you today?",
            color: ws.color || "#2563eb",
            widgetPosition: ws.widgetPosition || "bottom-right",
            widgetEnabled: ws.widgetEnabled ?? true,
            widgetAvatar: ws.widgetAvatar || "bot",
          });
        }
      }
    } catch (err) { console.error("Error fetching business:", err); }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await businessApi.updateWidgetSettings({ widgetSettings: settings });
      if (res.data.success) toast.success("Widget settings saved!");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    } finally { setIsSaving(false); }
  };

  const handleScrape = async () => {
    if (!websiteUrl) return;
    setIsScraping(true);
    try {
      const res = await knowledgeApi.scrapeWebsite({ url: websiteUrl });
      if (res.data.success) { toast.success("Website scraped successfully!"); setWebsiteUrl(""); }
    } catch (err) {
      console.error("Scraping error:", err);
      toast.error(err.response?.data?.message || "Failed to scrape website");
    } finally { setIsScraping(false); }
  };

  const copyEmbedCode = () => {
    const code = `<script src="http://localhost:3000/widget.js" data-business-id="${business?._id}"></script>`;
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const tabs = [
    { id: "customize", label: "Customize", icon: RiPaletteLine },
    { id: "website", label: "Train AI", icon: RiGlobalLine },
    { id: "embed", label: "Embed Code", icon: RiCodeSSlashLine },
  ];

  const selectedAvatar = AVATARS.find((a) => a.id === settings.widgetAvatar) ?? AVATARS[0];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.2em] mb-2">Configuration</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-none">Chat Widget</h1>
            <p className="text-gray-400 text-sm mt-2 font-medium">Configure and deploy your AI assistant</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 tracking-wide">Live Preview</span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* ── Left: Config ── */}
          <div className="flex-1 space-y-5">

            {/* Tabs */}
            <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex gap-1 shadow-sm">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === id ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-50 px-8 py-5">
                <h2 className="text-base font-bold text-gray-800">
                  {activeTab === "customize" && "Appearance & Behavior"}
                  {activeTab === "website" && "Train from Website"}
                  {activeTab === "embed" && "Integration Code"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  {activeTab === "customize" && "Personalize how your widget looks and feels"}
                  {activeTab === "website" && "Crawl your site to build AI knowledge"}
                  {activeTab === "embed" && "Add this snippet to your HTML to go live"}
                </p>
              </div>

              <div className="p-8">

                {/* ── CUSTOMIZE ── */}
                {activeTab === "customize" && (
                  <div className="space-y-8 animate-in fade-in duration-300">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Widget Title</label>
                        <input
                          type="text"
                          value={settings.title}
                          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm font-semibold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Brand Color</label>
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0">
                            <input
                              type="color"
                              value={settings.color}
                              onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div
                              className="w-[52px] h-[46px] rounded-xl border-4 border-white shadow-md cursor-pointer"
                              style={{ backgroundColor: settings.color }}
                            />
                          </div>
                          <input
                            type="text"
                            value={settings.color}
                            onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm font-mono font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Welcome Message</label>
                      <textarea
                        rows={3}
                        value={settings.welcomeMessage}
                        onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm font-semibold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* ── Avatar Picker ── */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                      <AvatarPicker
                        selectedId={settings.widgetAvatar}
                        color={settings.color}
                        onChange={(id) => setSettings({ ...settings, widgetAvatar: id })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Widget Position</label>
                        <div className="flex gap-3">
                          {[
                            { val: "bottom-left", Icon: RiLayoutLeftLine, label: "Left" },
                            { val: "bottom-right", Icon: RiLayoutRightLine, label: "Right" },
                          ].map(({ val, Icon, label }) => (
                            <button
                              key={val}
                              onClick={() => setSettings({ ...settings, widgetPosition: val })}
                              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all font-bold text-sm ${settings.widgetPosition === val
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600 bg-gray-50"
                                }`}
                            >
                              <Icon size={18} />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Visibility</label>
                        <div
                          className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 cursor-pointer hover:bg-gray-100/60 transition-all"
                          onClick={() => setSettings({ ...settings, widgetEnabled: !settings.widgetEnabled })}
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-800">Widget Enabled</p>
                            <p className="text-xs text-gray-400 font-medium">
                              {settings.widgetEnabled ? "Visible to visitors" : "Hidden from visitors"}
                            </p>
                          </div>
                          <div
                            className="relative flex items-center rounded-full transition-all duration-300"
                            style={{ width: 48, height: 26, backgroundColor: settings.widgetEnabled ? settings.color : "#e5e7eb" }}
                          >
                            <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${settings.widgetEnabled ? "left-[26px]" : "left-[3px]"}`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-gray-900/10"
                      >
                        {isSaving ? <RiLoader4Line className="animate-spin" size={18} /> : <RiSaveLine size={18} />}
                        Save Settings
                      </button>
                    </div>
                  </div>
                )}

                {/* ── TRAIN AI ── */}
                {activeTab === "website" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex gap-4 bg-blue-50 border border-blue-100/80 rounded-2xl p-5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <RiInformationLine className="text-blue-600" size={16} />
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed font-medium">
                        Enter your website URL below. SupportAI will automatically crawl your site and train your AI assistant with your business content.
                      </p>
                    </div>
                    <div className="space-y-2.5">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Website URL</label>
                      <div className="relative">
                        <RiGlobalLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                          type="url"
                          placeholder="https://yourbusiness.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleScrape}
                      disabled={isScraping || !websiteUrl}
                      className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-sm tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-gray-900/10"
                    >
                      {isScraping ? <><RiLoader4Line className="animate-spin" size={18} />Scraping Business Data…</> : <><RiGlobalLine size={18} />Train AI from Website</>}
                    </button>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {["Crawl Pages", "Extract Content", "Train Model"].map((step, i) => (
                        <div key={step} className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center mx-auto mb-2">{i + 1}</div>
                          <p className="text-xs font-semibold text-gray-500">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── EMBED ── */}
                {activeTab === "embed" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <RiCheckFill className="text-emerald-600" size={16} />
                      </div>
                      <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                        Your widget is ready! Paste this snippet just before the closing{" "}
                        <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md text-xs font-mono">&lt;/body&gt;</code>{" "}
                        tag of your website.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Embed Script</label>
                        <button onClick={copyEmbedCode} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                          <RiFileCopyLine size={13} />Copy Code
                        </button>
                      </div>
                      <div className="relative bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
                        <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-gray-800/80">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                          <span className="ml-3 text-[11px] text-gray-600 font-mono">index.html</span>
                        </div>
                        <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                          <code>
                            <span className="text-gray-500">{"<"}</span><span className="text-blue-400">script</span>
                            {"\n  "}<span className="text-emerald-400">src</span><span className="text-gray-500">{"="}</span><span className="text-amber-300">{'"http://localhost:3000/widget.js"'}</span>
                            {"\n  "}<span className="text-emerald-400">data-business-id</span><span className="text-gray-500">{"="}</span><span className="text-amber-300">{`"${business?._id ?? "your-id-here"}"`}</span>
                            <span className="text-gray-500">{">"}</span><span className="text-gray-500">{"</"}</span><span className="text-blue-400">script</span><span className="text-gray-500">{">"}</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      {["Open your website's HTML file", "Find the closing </body> tag", "Paste the script just before it", "Save and deploy — you're live!"].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          <span className="font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Live Preview ── */}
          <div className="w-full xl:w-[420px] flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">

                {/* Preview header */}
                <div className="mb-4 px-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Live Preview</span>
                    {/* Avatar name pill */}
                    <span
                      className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{ color: settings.color, borderColor: settings.color + "40", backgroundColor: settings.color + "10" }}
                    >
                      <span className="w-4 h-4 inline-flex">{<img
                        src={selectedAvatar.image}
                        alt={selectedAvatar.label}
                        className="w-full h-full object-cover rounded-full"
                      />}</span>
                      {selectedAvatar.label}
                    </span>
                  </div>
                  {!settings.widgetEnabled && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">Hidden</span>
                  )}
                </div>

                {/* Browser frame */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden" style={{ height: 630 }}>
                  <div className="bg-gray-200/80 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-white/70 rounded-md h-5 flex items-center px-3">
                      <span className="text-[10px] text-gray-400 font-medium truncate">https://yourbusiness.com</span>
                    </div>
                  </div>

                  <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100/40 overflow-hidden">
                    {/* Page skeleton */}
                    <div className="p-6 space-y-3 opacity-20">
                      <div className="h-3 w-1/2 bg-gray-400 rounded-full" />
                      <div className="h-2 w-3/4 bg-gray-300 rounded-full" />
                      <div className="h-2 w-2/3 bg-gray-300 rounded-full" />
                      <div className="h-24 w-full bg-gray-300 rounded-xl mt-4" />
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="h-14 bg-gray-300 rounded-xl" />
                        <div className="h-14 bg-gray-300 rounded-xl" />
                        <div className="h-14 bg-gray-300 rounded-xl" />
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full mt-2" />
                      <div className="h-2 w-4/5 bg-gray-200 rounded-full" />
                    </div>

                    {/* Widget */}
                    <div
                      className={`absolute bottom-5 transition-all duration-500 ${settings.widgetPosition === "bottom-right" ? "right-4" : "left-4"
                        } ${!settings.widgetEnabled ? "opacity-30 grayscale" : ""}`}
                      style={{ width: 300 }}
                    >
                      {/* Chat window */}
                      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col" style={{ height: 440 }}>

                        {/* Header */}
                        <div
                          className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
                          style={{ backgroundColor: settings.color }}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 p-1.5">
                            <AvatarDisplay avatarId={selectedAvatar} color="white" size="md" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-white truncate leading-none">{settings.title}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                              <span className="text-[9px] text-white opacity-75 font-medium">Online · Replies instantly</span>
                            </div>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-gray-50/60">
                          {/* Bot msg 1 */}
                          <div className="flex gap-2 items-end">
                            <div
                              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center p-1"
                              style={{ backgroundColor: settings.color + "18" }}
                            >
                              <AvatarDisplay avatarId={settings.widgetAvatar} color={settings.color} size="sm" />
                            </div>
                            <div className="bg-white border border-gray-100 px-3 py-2.5 rounded-2xl rounded-bl-sm text-xs text-gray-700 max-w-[82%] shadow-sm leading-relaxed">
                              {settings.welcomeMessage}
                            </div>
                          </div>

                          {/* User msg */}
                          <div className="flex justify-end">
                            <div
                              className="px-3 py-2.5 rounded-2xl rounded-br-sm text-xs text-white max-w-[80%] leading-relaxed"
                              style={{ backgroundColor: settings.color }}
                            >
                              How do I integrate this?
                            </div>
                          </div>

                          {/* Bot msg 2 */}
                          <div className="flex gap-2 items-end">
                            <div
                            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center p-1"
                            style={{ backgroundColor: settings.color + "18" }}
                          >
                            <AvatarDisplay avatarId={settings.widgetAvatar} color={settings.color} size="sm" />
                          </div>
                            <div className="bg-white border border-gray-100 px-3 py-2.5 rounded-2xl rounded-bl-sm text-xs text-gray-700 max-w-[82%] shadow-sm leading-relaxed">
                              Copy the snippet from the{" "}
                              <span className="font-bold">Embed Code</span> tab and paste before{" "}
                              <code className="bg-gray-100 px-1 rounded text-[10px]">&lt;/body&gt;</code> 🚀
                            </div>
                          </div>
                        </div>

                        {/* Footer input */}
                        <div className="p-3 border-t border-gray-50 bg-white flex gap-2 flex-shrink-0">
                          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[11px] text-gray-300 flex items-center font-medium">
                            Type a message…
                          </div>
                          <button
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: settings.color }}
                          >
                            <RiSendPlane2Line size={15} className="text-white" />
                          </button>
                        </div>
                      </div>

                      {/* FAB */}
                      <div className={`mt-3 flex ${settings.widgetPosition === "bottom-right" ? "justify-end" : "justify-start"}`}>
                        <div
                          className="w-13 h-13 rounded-full shadow-2xl flex items-center justify-center p-2.5"
                          style={{ backgroundColor: settings.color, width: 52, height: 52 }}
                        >
                          <AvatarDisplay avatarId={settings.widgetAvatar} color="white" size="md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status row */}
                <div className="mt-4 px-2 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 font-medium">
                    {settings.widgetEnabled ? "Widget is active" : "Widget is hidden"}
                  </span>
                  <span className="font-semibold truncate max-w-[160px]" style={{ color: settings.color + "cc" }}>
                    ● {settings.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WidgetPage;