const Knowledge = require("../models/KnowledgeBase");
const Business = require("../models/Business");
const Subscription = require("../models/Subscription");

const createKnowledgeBase = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found. Please create a business first."
            });
        }

        const { title, content } = req.body;

        const newKnowledge = new Knowledge({    
            business: business._id,
            title,
            content,
        });
        await newKnowledge.save();

        // Update Subscription Usage
        await Subscription.findOneAndUpdate(
            { user: userId },
            { $inc: { "usage.knowledgeEntriesUsed": 1 } }
        );

        // Auto-resolve related tickets
        try {
            const Ticket = require("../models/Ticket");
            const searchTerms = title
                .split(/\s+/)
                .filter((word) => word.length > 3)
                .join("|");

            if (searchTerms) {
                const relatedTickets = await Ticket.find({
                    business: business._id,
                    status: { $in: ["Open", "In Progress"] },
                    $or: [
                        { subject: { $regex: searchTerms, $options: "i" } },
                        { description: { $regex: searchTerms, $options: "i" } }
                    ]
                });

                if (relatedTickets.length > 0) {
                    await Ticket.updateMany(
                        { _id: { $in: relatedTickets.map(t => t._id) } },
                        { $set: { status: "resolved" } }
                    );
                    console.log(`Auto-resolved ${relatedTickets.length} tickets for business ${business._id}`);
                }
            }
        } catch (autoResolveError) {
            console.error("Error during auto-resolving tickets:", autoResolveError);
        }

        res.status(201).json({
            success: true,
            message: "Knowledge base entry created successfully",
            knowledge: newKnowledge
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating Knowledge base entry",
            error: error.message
        });
    }
}

const getMyKnowledgeBase = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const KnowledgeEntries = await Knowledge
            .find({ 
                business: business._id,
                sourceType: { $ne: "website" } // Only show manual entries
            })
            .select("title content category createdAt sourceType")
            .sort({ createdAt: -1 });

        const formattedEntries = KnowledgeEntries.map((entry) => ({
            id: entry._id,
            title: entry.title,
            content: entry.content,
            categories: entry.category ? [entry.category] : [],
            createdDate: entry.createdAt
        }));

        res.status(200).json({
            success: true,
            knowledge: formattedEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching Knowledge base entries",
            error: error.message
        });
    }
}

const getKnowledgeById = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const KnowledgeEntry = await Knowledge
            .findOne({ _id: req.params.id, business: business._id })
            .select("title content category createdAt updatedAt keywords sourceType sourceUrl fileUrl isActive trained lastTrainedAt");

        if (!KnowledgeEntry) {
            return res.status(404).json({
                success: false,
                message: "Knowledge entry not found"
            });
        }

        res.status(200).json({
            success: true,
            Knowledge: {
                id: KnowledgeEntry._id,
                title: KnowledgeEntry.title,
                content: KnowledgeEntry.content,
                category: KnowledgeEntry.category,
                createdDate: KnowledgeEntry.createdAt,
                updatedDate: KnowledgeEntry.updatedAt,
                keywords: KnowledgeEntry.keywords,
                sourceType: KnowledgeEntry.sourceType,
                sourceUrl: KnowledgeEntry.sourceUrl,
                fileUrl: KnowledgeEntry.fileUrl,
                isActive: KnowledgeEntry.isActive,
                trained: KnowledgeEntry.trained,
                lastTrainedAt: KnowledgeEntry.lastTrainedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching Knowledge base entry",
            error: error.message
        });
    }
}

const updateKnowledge = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const { title, content, category, keywords } = req.body;
        
        const KnowledgeEntry = await Knowledge.findOneAndUpdate(
            { _id: req.params.id, business: business._id },
            { title, content, category, keywords, trained: false },
            { new: true }
        );

        if (!KnowledgeEntry) {
            return res.status(404).json({
                success: false,
                message: "Knowledge entry not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Knowledge updated successfully",
            Knowledge: KnowledgeEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating Knowledge",
            error: error.message
        });
    }
}

const deleteKnowledge = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const KnowledgeEntry = await Knowledge.findOneAndDelete({ 
            _id: req.params.id, 
            business: business._id 
        });

        if (!KnowledgeEntry) {
            return res.status(404).json({
                success: false,
                message: "Knowledge entry not found"
            });
        }

        // Update Subscription Usage
        await Subscription.findOneAndUpdate(
            { user: userId },
            { $inc: { "usage.knowledgeEntriesUsed": -1 } }
        );

        res.status(200).json({
            success: true,
            message: "Knowledge deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting Knowledge",
            error: error.message
        });
    }
}

const searchKnowledge = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const query = req.query.q || "";
        const KnowledgeEntries = await Knowledge
            .find({
                business: business._id,
                isActive: true,
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { content: { $regex: query, $options: "i" } },
                    { category: { $regex: query, $options: "i" } },
                    { keywords: { $in: [new RegExp(query, "i")] } }
                ]
            })
            .select("title content category createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            Knowledge: KnowledgeEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching Knowledge",
            error: error.message
        });
    }
}

const uploadFileKnowledge = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const { title, category } = req.body;
        let extractedText = "";

        // Text Extraction Logic
        try {
            if (req.file.mimetype === "application/pdf") {
                const pdfParse = require("pdf-parse");
                const data = await pdfParse(req.file.buffer);
                extractedText = data.text;
            } else if (
                req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                req.file.mimetype === "application/msword"
            ) {
                const docxParser = require("docx-parser");
                // For buffers, we might need a different approach or temporary file
                // Simplified for now: assuming text files if not pdf/docx
                extractedText = req.file.buffer.toString('utf-8');
            } else if (req.file.mimetype === "text/plain") {
                extractedText = req.file.buffer.toString('utf-8');
            } else {
                extractedText = req.file.buffer.toString('utf-8');
            }
        } catch (parseError) {
            console.error("File Parse Error:", parseError);
            return res.status(400).json({
                success: false,
                message: "Failed to extract text from file"
            });
        }

        if (!extractedText || extractedText.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "The uploaded file contains no readable text or is too short."
            });
        }

        const newKnowledge = new Knowledge({
            business: business._id,
            title: title || req.file.originalname,
            content: extractedText.trim().substring(0, 50000), // Limit to 50k chars
            category: category || "document",
            sourceType: "file",
            fileUrl: req.file.originalname
        });

        await newKnowledge.save();

        res.status(201).json({
            success: true,
            message: "File uploaded and processed successfully",
            knowledge: newKnowledge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: error.message
        });
    }
}

const { chromium } = require("playwright");

const scrapeWebsiteKnowledge = async (req, res) => {
    let browser;
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: true,
                message: "Business not found"
            });
        }

        let { url } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        // Ensure URL has a protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Invalid URL format. Please provide a valid website address."
            });
        }

        // 1. Launch Playwright
        browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();

        // 2. Navigate to URL
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

        // 3. Extract content
        const title = await page.title() || `Website Content from ${new URL(url).hostname}`;
        const content = await page.locator("body").innerText();

        // 4. Clean content
        const cleanedContent = content
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 15000); 

        if (!cleanedContent || cleanedContent.length < 50) {
            await browser.close();
            return res.status(400).json({
                success: false,
                message: "Could not extract enough meaningful content from the website."
            });
        }

        // 5. Close browser
        await browser.close();

        // 6. Save to KnowledgeBase
        const newKnowledge = new Knowledge({
            business: business._id,
            title: title,
            content: cleanedContent,
            category: "website",
            sourceType: "website",
            sourceUrl: url,
            isActive: true,
            trained: false
        });

        await newKnowledge.save();

        res.status(201).json({
            success: true,
            message: "Website content scraped successfully using Playwright",
            knowledge: newKnowledge
        });
    } catch (error) {
        if (browser) await browser.close();
        console.error("Playwright Scraping Error:", error);
        
        let errorMessage = "Error scraping website";
        if (error.name === 'TimeoutError') {
            errorMessage = "The website took too long to respond. It might be blocked or very slow.";
        } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
            errorMessage = "Connection refused. Please check if the URL is correct and the site is up.";
        } else {
            errorMessage = error.message || "An unexpected error occurred during scraping.";
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message || "Unknown error"
        });
    }
}

const trainAI = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        await Knowledge.updateMany(
            { business: business._id },
            { trained: true, lastTrainedAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: "AI training completed"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error training AI",
            error: error.message
        });
    }
}

const getKnowledgeCategories = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const categories = await Knowledge.distinct("category", {
            business: business._id
        });

        res.status(200).json({
            success: true,
            categories: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
}

const toggleKnowledgeStatus = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId || req.user.id;
        const business = await Business.findOne({ owner: userId }).select("_id");

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const KnowledgeEntry = await Knowledge.findOne({
            _id: req.params.id,
            business: business._id
        });

        if (!KnowledgeEntry) {
            return res.status(404).json({
                success: false,
                message: "Knowledge entry not found"
            });
        }

        KnowledgeEntry.isActive = !KnowledgeEntry.isActive;
        await KnowledgeEntry.save();

        res.status(200).json({
            success: true,
            message: "Knowledge status updated",
            Knowledge: KnowledgeEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating Knowledge status",
            error: error.message
        });
    }
}

const publicKnowledgeSearch = async (req, res) => {
    try {
        const { businessId, query } = req.body;

        if (!businessId) {
            return res.status(400).json({
                success: false,
                message: "Business ID is required"
            });
        }

        const KnowledgeEntries = await Knowledge
            .find({
                business: businessId,
                isActive: true,
                $or: [
                    { title: { $regex: query || "", $options: "i" } },
                    { content: { $regex: query || "", $options: "i" } }
                ]
            })
            .select("title content category")
            .limit(10);

        res.status(200).json({
            success: true,
            Knowledge: KnowledgeEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching public Knowledge",
            error: error.message
        });
    }
}

module.exports = {
    createKnowledgeBase,
    getMyKnowledgeBase,
    getKnowledgeById,
    updateKnowledge,
    deleteKnowledge,
    searchKnowledge,
    uploadFileKnowledge,
    scrapeWebsiteKnowledge,
    trainAI,
    getKnowledgeCategories,
    toggleKnowledgeStatus,
    publicKnowledgeSearch
}
