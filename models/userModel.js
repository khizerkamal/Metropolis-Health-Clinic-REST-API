const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [ true,'Please provide your email' ],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [ true,'Please provide a password' ],
        minlength: 8,
        select: false,
    },
    userType: {
        type: String,
        required: [ true,'This field is required' ],
        enum: [ 'patient','doctor','admin' ],
    },
    status: {
        type: Boolean,
        default: false,
    }
})

// Hashing Password before saving into the DB
userSchema.pre('save',async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    next();
})

// Method for signing JWT Token
userSchema.methods.signToken = function (payload, expiry) {
    return jwt.sign(
        payload,
        process.env.JWT_TOKEN_SECRET,
        {expiresIn: expiry} 
    )
}

const User = mongoose.model('User',userSchema,'Users')
module.exports = User