const plans = {
    Free: {
        maxBusinesses: 1,
        maxKnowledgeEntries: 10,
        maxChatsPerMonth: 100,
        maxAiRepliesPerMonth: 50,
        maxTeamMembers: 1,
        price: 0
    },
    Pro: {
        maxBusinesses: 5,
        maxKnowledgeEntries: 500,
        maxChatsPerMonth: 5000,
        maxAiRepliesPerMonth: 3000,
        maxTeamMembers: 5,
        price: 1499
    },
    Enterprise: {
        maxBusinesses: -1, // -1 for unlimited
        maxKnowledgeEntries: -1,
        maxChatsPerMonth: -1,
        maxAiRepliesPerMonth: -1,
        maxTeamMembers: -1,
        price: 2999
    }
};

module.exports = plans;
