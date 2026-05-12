const Ticket = require("../models/Ticket");
const Business = require("../models/Business");
const User = require("../models/User");
const { sendEmail } = require("../util/mail");

const createTicket = async (req, res) => {
  try {
    const { businessId, customer, customerName, customerEmail, subject, description, priority } = req.body;

    if (!businessId || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Business ID, subject, and description are required"
      });
    }

    const newTicket = new Ticket({
      business: businessId,
      customer: customer || "guest",
      customerName: customerName || "Guest",
      customerEmail: customerEmail,
      subject,
      description,
      priority: priority || "Medium"
    });

    await newTicket.save();

    // Send Notification to Business Owner
    try {
      const business = await Business.findById(businessId).populate("owner");
      if (business && business.owner && business.owner.email) {
        await sendEmail(
          business.owner.email,
          `New Support Ticket: ${subject}`,
          `A new support ticket has been created for ${business.businessName}.\n\nCustomer: ${customerName}\nSubject: ${subject}\nDescription: ${description}`,
          `<h1>New Support Ticket</h1>
           <p><strong>Business:</strong> ${business.businessName}</p>
           <p><strong>Customer:</strong> ${customerName} (${customerEmail || 'N/A'})</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Description:</strong> ${description}</p>
           <p><strong>Priority:</strong> ${priority || 'Medium'}</p>`
        );
      }
    } catch (mailError) {
      console.error("Failed to send ticket notification email:", mailError);
    }

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating ticket",
      error: error.message
    });
  }
};

const getBusinessTickets = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const tickets = await Ticket
      .find({ business: business._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tickets",
      error: error.message
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      business: business._id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      ticket: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ticket",
      error: error.message
    });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "resolved", "Closed"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: Open, In Progress, resolved, Closed"
      });
    }

    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, business: business._id },
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully",
      ticket: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating ticket status",
      error: error.message
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.id,
      business: business._id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting ticket",
      error: error.message
    });
  }
};

module.exports = {
  createTicket,
  getBusinessTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket
};
