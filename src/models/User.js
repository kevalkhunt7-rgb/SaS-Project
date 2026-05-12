const mangoose = require("mongoose")

const userSchema = new mangoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ProfilePic: {
        url: {
            type: String,
            default: "",
        },

        public_id: {
            type: String,
            default: "",
        },
    },
    role: { 
        type: String, 
        enum: ["owner", "admin", "agent", "customer"], 
        default: "customer" 
    },
    business: {
        type: mangoose.Schema.Types.ObjectId,
        ref: "Business"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordCode: String
}, {
    timestamps: true
})

const User = mangoose.model("User", userSchema)

module.exports = User