const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    username:{
        type:String
    },
    token:{
        type:String
    },
    email: { 
        type: String, 
        required: true, unique: true 
    },
    phoneNumber: { 
        type: String, 
        required: true, unique: true 
    },
    password: { type: String, 
        required: true 
    },
    interests: [String],
    isEmailVerified: { 
        type: Boolean, 
        default: false 
    },
    isPhoneNumberVerified: { 
        type: Boolean, default: false 
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    otp:{ 
        type: String, required: false
     },
    otpExpires:{ 
        type: Date, required: false 
    },
});

module.exports = mongoose.model('User', userSchema);
