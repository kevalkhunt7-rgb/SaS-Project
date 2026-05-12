(function () {
  if (window.SupportAIWidget) return;
  window.SupportAIWidget = true;

  const API_BASE_URL = "https://sas-project-p56n.onrender.com";
  const FRONTEND_BASE_URL = "https://sa-s-project.vercel.app/" || "sa-s-project-git-main-kevalkhunt7-5969s-projects.vercel.app" || "sa-s-project-4gqh0ku5c-kevalkhunt7-5969s-projects.vercel.appdel package-lock.json";
  const scriptTag = document.currentScript;
  const businessId = scriptTag.getAttribute("data-business-id");

  if (!businessId) {
    console.error("SupportAI Widget: Missing data-business-id attribute.");
    return;
  }

  let isOpen = false;
  let conversationId = null;
  let settings = {
    title: "SupportAI Assistant",
    welcomeMessage: "Hi! How can I help you today?",
    color: "#2563eb",
    widgetAvatar: "avt1",
    widgetPosition: "bottom-right",
    widgetEnabled: true
  };

  const getAvatarHtml = (id) => {
    const avatars = {
      avt1: `${FRONTEND_BASE_URL}/Avt1.svg`,
      avt2: `${FRONTEND_BASE_URL}/Avt2.svg`,
      avt3: `${FRONTEND_BASE_URL}/Avt3.svg`,
      avt4: `${FRONTEND_BASE_URL}/Avt4.svg`,
      avt5: `${FRONTEND_BASE_URL}/Avt5.svg`,
    };
    const src = avatars[id] || avatars['avt1'];
    return `<img src="${src}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;
  };

  const injectStyles = (config) => {
    const style = document.createElement("style");
    const isLeft = config.widgetPosition === "bottom-left";
    
    style.innerHTML = `
      #support-ai-widget-container {
        position: fixed;
        bottom: 24px;
        ${isLeft ? "left: 24px;" : "right: 24px;"}
        z-index: 99;
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
      }
      
      #support-ai-button {
        width: 60px; height: 60px; border-radius: 50%;
        background-color: ${config.color};
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      #support-ai-button:hover { transform: scale(1.1) rotate(5deg); }
      
      #support-ai-window {
        position: absolute; bottom: 80px; ${isLeft ? "left: 0;" : "right: 0;"}
        width: 380px; height: 600px; max-height: calc(100vh - 120px);
        background: #ffffff; border-radius: 24px; display: none; flex-direction: column;
        overflow: hidden; animation: supportAiSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); border: 1px solid rgba(0,0,0,0.08);
      }
      
      @keyframes supportAiSlideUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      
      #support-ai-header { 
        background: ${config.color}; 
        padding: 24px 20px; 
        color: white; 
        display: flex; 
        align-items: center; 
        justify-content: space-between;
        background-image: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%);
      }
      #support-ai-header h4 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
      #support-ai-header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; display: flex; align-items: center; }
      #support-ai-header p::before { content: ""; width: 8px; height: 8px; background: #4ade80; border-radius: 50%; margin-right: 6px; }
      
      #support-ai-messages { 
        flex: 1; padding: 20px; overflow-y: auto; background: #fcfcfd; 
        display: flex; flex-direction: column; gap: 8px; 
        scroll-behavior: smooth;
      }
      
      .support-ai-msg-wrapper { display: flex; gap: 10px; align-items: flex-end; margin-bottom: 8px; max-width: 85%; }
      .support-ai-msg-wrapper.customer-wrap { align-self: flex-end; flex-direction: row-reverse; }
      
      .support-ai-avatar { width: 28px; height: 28px; flex-shrink: 0; margin-bottom: 2px; }
      
      .support-ai-message { 
        padding: 12px 16px; font-size: 14.5px; line-height: 1.5; 
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      
      .support-ai-message.ai { 
        background: #ffffff; color: #334155; 
        border-radius: 18px 18px 18px 4px; 
        border: 1px solid #f1f5f9;
      }
      
      .support-ai-message.customer { 
        background: ${config.color}; color: white; 
        border-radius: 18px 18px 4px 18px; 
      }
      
      #support-ai-input-container { 
        padding: 16px; background: white; border-top: 1px solid #f1f5f9; 
        display: flex; gap: 8px; align-items: center;
      }
      
      #support-ai-input { 
        flex: 1; border: 1px solid #e2e8f0; padding: 12px 16px; 
        border-radius: 25px; outline: none; transition: border 0.2s;
        font-size: 14px;
      }
      #support-ai-input:focus { border-color: ${config.color}; }
      
      #support-ai-send { 
        background: transparent; border: none; color: ${config.color};
        cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s;
      }
      #support-ai-send:hover { transform: scale(1.1); }
      
      .support-ai-typing { 
        display: flex; gap: 4px; padding: 12px 16px; 
        background: white; border-radius: 18px; width: fit-content; 
        border: 1px solid #f1f5f9; margin-left: 38px;
      }
      .support-ai-dot { width: 5px; height: 5px; background: #cbd5e1; border-radius: 50%; animation: supportAiBounce 1.4s infinite; }
      @keyframes supportAiBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
    `;
    document.head.appendChild(style);
  };

  const createWidget = (config) => {
    const container = document.createElement("div");
    container.id = "support-ai-widget-container";
    container.innerHTML = `
      <div id="support-ai-window">
        <div id="support-ai-header">
          <div><h4>${config.title}</h4><p>Replies instantly</p></div>
          <div style="cursor: pointer; opacity: 0.8; transition: 0.2s" id="support-ai-close" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        </div>
        <div id="support-ai-messages"></div>
        <div id="support-ai-input-container">
          <input type="text" id="support-ai-input" placeholder="Type your message...">
          <button id="support-ai-send">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
          </button>
        </div>
      </div>
      <div id="support-ai-button">
        ${getAvatarHtml(config.widgetAvatar)}
      </div>
    `;
    document.body.appendChild(container);

    const btn = document.getElementById("support-ai-button");
    const win = document.getElementById("support-ai-window");
    const close = document.getElementById("support-ai-close");
    const input = document.getElementById("support-ai-input");
    const send = document.getElementById("support-ai-send");
    const messages = document.getElementById("support-ai-messages");

    const toggle = () => {
      isOpen = !isOpen;
      win.style.display = isOpen ? "flex" : "none";
      if (isOpen && !conversationId) startChat();
    };

    btn.onclick = toggle;
    close.onclick = toggle;

    const addMessage = (text, type) => {
      const wrapper = document.createElement("div");
      wrapper.className = `support-ai-msg-wrapper ${type === 'customer' ? 'customer-wrap' : 'ai-wrap'}`;
      
      let avatarHtml = type === "ai" ? `<div class="support-ai-avatar">${getAvatarHtml(settings.widgetAvatar)}</div>` : "";

      wrapper.innerHTML = `${avatarHtml}<div class="support-ai-message ${type}">${text}</div>`;
      messages.appendChild(wrapper);
      messages.scrollTop = messages.scrollHeight;
    };

    const showTyping = () => {
      const typingDiv = document.createElement("div");
      typingDiv.id = "support-ai-typing-indicator";
      typingDiv.className = "support-ai-typing";
      typingDiv.innerHTML = '<div class="support-ai-dot"></div><div class="support-ai-dot" style="animation-delay: 0.2s"></div><div class="support-ai-dot" style="animation-delay: 0.4s"></div>';
      messages.appendChild(typingDiv);
      messages.scrollTop = messages.scrollHeight;
    };

    const removeTyping = () => {
      const indicator = document.getElementById("support-ai-typing-indicator");
      if (indicator) indicator.remove();
    };

    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text || !conversationId) return;
      input.value = "";
      addMessage(text, "customer");
      showTyping();

      try {
        await fetch(`${API_BASE_URL}/public/chat/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, message: text })
        });

        const res = await fetch(`${API_BASE_URL}/ai/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, customerQuestion: text })
        });
        
        const data = await res.json();
        removeTyping();
        addMessage(data.success ? data.aiReply : "Sorry, I'm having trouble right now.", "ai");
      } catch (err) {
        removeTyping();
        addMessage("Connection error.", "ai");
      }
    };

    send.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };

    const startChat = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/chat/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId })
        });
        const data = await res.json();
        if (data.success) {
          conversationId = data.conversation._id;
          addMessage(data.welcomeMessage.message, "ai");
        }
      } catch (err) { console.error("Chat start failed", err); }
    };
  };

  const init = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/public/business/id/${businessId}`);
      const data = await res.json();
      if (data.success && data.business) {
        const b = data.business;
        const ws = b.widgetSettings || {};
        settings = {
          ...settings,
          title: ws.title || b.businessName,
          welcomeMessage: ws.welcomeMessage || settings.welcomeMessage,
          color: ws.color || b.brandColor || settings.color,
          widgetAvatar: ws.widgetAvatar || settings.widgetAvatar,
          widgetPosition: ws.widgetPosition || settings.widgetPosition,
          widgetEnabled: ws.widgetEnabled ?? true
        };
        if (settings.widgetEnabled) {
          injectStyles(settings);
          createWidget(settings);
        }
      }
    } catch (err) { console.error("Init failed", err); }
  };

  init();
})();