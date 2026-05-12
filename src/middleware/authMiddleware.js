const JWT = require("jsonwebtoken")
const user = require("../models/User")

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = JWT.verify(token,process.env.JWT_SECRET);
        req.user = await user.findById(decoded.userId).select("-password");
        next();
    } catch (error) {
            res.status(401).send({
                success: false,
                message: 'Unauthorized Access',
                error: error.message
            })
        }
    }



    module.exports = authMiddleware;