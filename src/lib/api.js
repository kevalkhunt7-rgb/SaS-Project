import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const authApi = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    forgotPassword: (data) => api.post("/auth/forgot-password", data),
    resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
    refresh: () => api.get("/auth/refresh"),
    getMe: () => api.get("/auth/me"),
    verifyResetCode: (data) => api.post("/auth/verify-reset-code", data),
    resetPasswordWithCode: (data) => api.post("/auth/reset-password-with-code", data),
};

// Admin APIs
export const adminApi = {
    getStats: () => api.get("/admin/stats"),
    getUsers: () => api.get("/admin/users"),
    getBusinesses: () => api.get("/admin/businesses"),
    updateUserRole: (data) => api.patch("/admin/user-role", data),
    deleteUser: (id) => api.delete(`/admin/user/${id}`),
    deleteBusiness: (id) => api.delete(`/admin/business/${id}`),
};

// Business APIs
export const businessApi = {
    create: (data) => api.post("/business/create", data),
    getMyBusiness: () => api.get("/business/my-business"),
    update: (data) => api.patch("/business/update", data),
    getWidgetSettings: () => api.get("/business/widget-settings"),
    updateWidgetSettings: (data) => api.patch("/business/widget-settings", data),
    getAiSettings: () => api.get("/business/ai-settings"),
    updateAiSettings: (data) => api.patch("/business/ai-settings", data),
};

// Knowledge APIs
export const knowledgeApi = {
    getMyKnowledge: () => api.get("/knowledge/my"),
    getById: (id) => api.get(`/knowledge/${id}`),
    create: (data) => api.post("/knowledge/create", data),
    update: (id, data) => api.put(`/knowledge/update/${id}`, data),
    delete: (id) => api.delete(`/knowledge/delete/${id}`),
    search: (query) => api.get(`/knowledge/search?q=${query}`),
    upload: (formData) => api.post("/knowledge/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    scrapeWebsite: (data) => api.post("/knowledge/scrape-website", data),
    trainAI: () => api.post("/knowledge/train-ai"),
    getCategories: () => api.get("/knowledge/categories"),
    toggleStatus: (id) => api.put(`/knowledge/toggle-status/${id}`),
};

// Conversation APIs
export const conversationApi = {
    start: (data) => api.post("/conversation/start", data),
    getBusinessConversations: () => api.get("/conversation/business"),
    getById: (id) => api.get(`/conversation/${id}`),
    close: (id) => api.put(`/conversation/close/${id}`),
    delete: (id) => api.delete(`/conversation/delete/${id}`),
};

// Message APIs
export const messageApi = {
    send: (data) => api.post("/message/send", data),
    getByConversation: (conversationId) => api.get(`/message/${conversationId}`),
};

// AI APIs
export const aiApi = {
    reply: (data) => api.post("/ai/reply", data),
    businessAssistant: (data) => api.post("/ai/business-assistant", data),
};

// Ticket APIs
export const ticketApi = {
    create: (data) => api.post("/ticket/create", data),
    getBusinessTickets: () => api.get("/ticket/business"),
    getById: (id) => api.get(`/ticket/${id}`),
    updateStatus: (id, status) => api.put(`/ticket/update-status/${id}`, { status }),
    delete: (id) => api.delete(`/ticket/delete/${id}`),
};

// Dashboard APIs
export const dashboardApi = {
    getStats: () => api.get("/dashboard/stats"),
    getCharts: () => api.get("/dashboard/charts"),
};

// Subscription APIs
export const subscriptionApi = {
    getCurrent: () => api.get("/subscription/current"),
    getPlans: () => api.get("/subscription/plans"),
    createOrder: (planName) => api.post("/subscription/create-order", { planName }),
    verifyPayment: (data) => api.post("/subscription/verify-payment", data),
};

// Public APIs (for Widget)
export const publicApi = {
    getBusinessBySlug: (slug) => api.get(`/public/business/${slug}`),
    startChat: (data) => api.post("/public/chat/start", data),
    sendChatMessage: (data) => api.post("/public/chat/message", data),
    searchKnowledge: (data) => api.post("/public/knowledge/search", data),
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403 && error.response.data.upgradeRequired) {
            // Handle subscription limit reached
            if (typeof window !== "undefined") {
                // You could use a custom event or a store to trigger a modal
                window.dispatchEvent(new CustomEvent("subscriptionLimitReached", { detail: error.response.data }));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
