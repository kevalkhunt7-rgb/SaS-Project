const Business = require('../models/Business');
const Chat = require('../models/Chats');
const Ticket = require('../models/Ticket');
const Feedback = require('../models/Feedback');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "business-logos",
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const Subscription = require('../models/Subscription');

const createBusiness = async (req, res) => {
    try {
        const { businessName, industry, description, supportEmail, phone, website } = req.body;
        const owner = req.user._id || req.user.id;

        const slug = businessName.toLowerCase().replace(/\s+/g, '-');
        const isbusinessExist = await Business.findOne({ slug });
        if (isbusinessExist) {
            return res.status(400).json({ message: 'Business name already exists' });
        }
        
        const existingBusiness = await Business.findOne({ owner });
        if (existingBusiness) {
            return res.status(400).json({ success: false, message: 'You already have a business' });
        }

        const business = await Business.create({
            businessName,
            industry,
            description,
            supportEmail,
            phone,
            website,
            owner,
            slug
        });

        // Update Subscription Usage
        await Subscription.findOneAndUpdate(
            { user: owner },
            { $inc: { "usage.businessesUsed": 1 } }
        );

        res.status(201).json({ success: true, message: 'Business created successfully', business });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating business', error: error.message });
    }
}

const MyBusiness = async (req, res, next) => {
    try {

        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }
        res.status(200).json({ success: true, business });

    } catch (error) {
        res.status(403).send({
            success: false,
            message: 'no business available',
            error: error.message
        })
    }

}

const updateBusiness = async (req, res) => {
    try {
        const {
            businessName,
            industry,
            description,
            supportEmail,
            phone,
            website,
        } = req.body;

        const userId = req.user._id || req.user.userId || req.user.id;

        const business = await Business.findOne({
            owner: userId,
        });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        if (typeof business.logo === "string") {
            business.logo = {
                url: business.logo || "",
                public_id: "",
            };
        }

        business.businessName = businessName || business.businessName;
        business.industry = industry || business.industry;
        business.description = description || business.description;
        business.supportEmail = supportEmail || business.supportEmail;
        business.phone = phone || business.phone;
        business.website = website || business.website;

        if (req.file) {
            if (business.logo?.public_id) {
                await cloudinary.uploader.destroy(business.logo.public_id);
            }

            const result = await uploadFromBuffer(req.file.buffer);

            business.logo = {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }

        await business.save();

        res.status(200).json({
            success: true,
            message: "Business updated successfully",
            business,
        });
        console.log("REQ USER:", req.user);
        console.log("REQ BODY:", req.body);
        console.log("REQ FILE:", req.file);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error updating business",
            error: error.message,
        });

    }
};
const deleteBusiness = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;

        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        await business.deleteOne();

        // Update Subscription Usage
        await Subscription.findOneAndUpdate(
            { user: userId },
            { $inc: { "usage.businessesUsed": -1 } }
        );

        res.status(200).json({
            success: true,
            message: "Business deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting business",
            error: error.message,
        });
    }
}

const getWidgetSettings = async (req, res) => {

    try {
        const userId = req.user._id || req.user.userId || req.user.id;

        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        res.status(200).json({
            success: true,
            widgetSettings: business.widgetSettings,
        });
        console.log(business.widgetSettings)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching widget settings",
            error: error.message,
        });
    }
}

const updateWidgetSettings = async (req, res) => {

    try {
        const userId = req.user._id || req.user.userId || req.user.id;

        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }

        business.widgetSettings = { 
            title: req.body.widgetSettings?.title || business.widgetSettings.title,
            color: req.body.widgetSettings?.color || business.widgetSettings.color,
            widgetPosition: req.body.widgetSettings?.widgetPosition || business.widgetSettings.widgetPosition,
            widgetEnabled: req.body.widgetSettings?.widgetEnabled !== undefined ? req.body.widgetSettings.widgetEnabled : business.widgetSettings.widgetEnabled,
            welcomeMessage: req.body.widgetSettings?.welcomeMessage || business.widgetSettings.welcomeMessage,
            widgetAvatar: req.body.widgetSettings?.widgetAvatar || business.widgetSettings.widgetAvatar
        };

        await business.save();

        res.status(200).json({
            success: true,
            message: "Widget settings updated successfully",
            widgetSettings: business.widgetSettings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating widget settings",
            error: error.message,
        });
    }
}

const getAiSettings = async (req, res) => {

    try {
        const userId = req.user._id || req.user.userId || req.user.id;

        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        res.status(200).json({
            success: true,
            aiSettings: business.aiSettings,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching AI settings",
            error: error.message,
        });
    }
}

const updateAiSettings = async (req, res) => {

    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        business.aiSettings = { ...business.aiSettings, ...req.body.aiSettings };
        await business.save();
        res.status(200).json({
            success: true,
            message: "AI settings updated successfully",
            aiSettings: business.aiSettings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating AI settings",
            error: error.message,
        });
    }
}

const businessDashboard = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;

        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        res.status(200).json({
            success: true,
            business,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard data",
            error: error.message,
        });
    }
}

const getBusinessAnalytics = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        const businessId = business._id;
        const totalChats = await Chat.countDocuments({ business: businessId });
        const aiChats = await Chat.countDocuments({ business: businessId, isAiResponse: true });
        const openTickets = await Ticket.countDocuments({ business: businessId, status: 'open' });
        const closedTickets = await Ticket.countDocuments({ business: businessId, status: 'closed' });
        const feedbacks = await Feedback.find({ business: businessId });

        let averageSatisfaction = 0;
        if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
            averageSatisfaction = totalRating / feedbacks.length;

        }
        const aiResponseRate = totalChats === 0 ? 0 : ((aiChats / totalChats) * 100).toFixed(2);

        res.status(200).json({
            analytics: {
                totalChats,
                aiResponseRate,
                ticketTrends: {
                    open: openTickets,
                    closed: closedTickets,
                },
                customerSatisfaction: averageSatisfaction,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching business analytics",
            error: error.message,
        });
    }
}

const getCurrentPlan = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });

        }
        res.status(200).json({
            success: true,
            currentPlan: business.plan,
        });

    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error fetching current plan",
            error: error.message,
        });
        
    }
}
const upgradePlan = async (req, res) => {
try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({
        owner: userId,
    });
    if (!business) {
        return res.status(404).json({
            success: false,
            message: "Business not found",
        });
    }
    const { newPlan } = req.body;
    if (!["Free", "Pro", "Enterprise"].includes(newPlan)) {
        return res.status(400).json({
            success: false,
            message: "Invalid plan selected",
        });
    }
    business.plan = newPlan;
    await business.save();
    res.status(200).json({
        success: true,
        message: `Plan upgraded to ${newPlan} successfully`,
        currentPlan: business.plan,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: "Error upgrading plan",
        error: error.message,
    });
}
}

const getBusinessDetails = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({
            owner: userId,
        });
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found",
            });
        }
        res.status(200).json({
            success: true,
            businessDetails: {
                businessName: business.businessName,
                businessLogo: business.logo?.url || "",
                widgetSettings: business.widgetSettings,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching business details",
            error: error.message,
        });
    }
}
            module.exports = {
                createBusiness,
                MyBusiness,
                updateBusiness,
                deleteBusiness,
                getWidgetSettings,
                updateWidgetSettings,
                getAiSettings,
                updateAiSettings,
                businessDashboard,
                getBusinessAnalytics,
                getCurrentPlan,
                upgradePlan,
                getBusinessDetails

            };