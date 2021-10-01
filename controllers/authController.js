const catchAsync = require('../utils/catchAsync')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')

const createSendToken = (user, statusCode, res, payload) => {
  const token = user.signToken(payload, '90d')
  const cookieOpions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    //secure: true,    // So the cookie will only be sent on an encrypted connection, i.e: HTTPS
    httpOnly: true   // So cannot be accessed or modified in any way by the browser, prevent from cross-site scripting attacks
  }

  if(process.env.NODE_ENV === 'PRODUCTION') cookieOpions.secure = true;
  res.cookie('token',token,cookieOpions)
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  })
}

exports.login = catchAsync(async (req,res,next) => {
  const { email,password } = req.body
  
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password')
  console.log(user)

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or Password', 401))
  }
 // 3) If everything ok then send token to client
 createSendToken(user,200,res,{
  id: user._id,
  name: user.name,
  userType: user.userType
})
})

exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType,
    })
  const payload = {
    id: newUser._id,
    status: true
  }
    const token = newUser.signToken(payload,'30m')
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/login/${token}`

  const message = `Welcome ${req.body.name} to the Metropolis Health Clinic, You can login by 
  clicking the below link\n${resetURL}`

  try {
    await sendEmail({
      email: newUser.email,
      subject: 'Metropolis Health Clinic Login (valid for 30 min)',
      message
    })
    res.status(201).json({
      success: true,
      message: `Email sent to ${newUser.email}`
    })
  } catch (error) {
    await deleteOne({email: req.body.email})
    next(
      new AppError('There was an error sending the email. Try again later!', 500)
    ) 
  }
})

exports.regLogin = catchAsync(async (req,res,next) => {
  const token = req.params.token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN_SECRET)
  const user = await User.findById({ _id: decoded.id })
  if(!user) return next(new AppError('user not found', 404))
  user.status = decoded.status
  await user.save();
  
  createSendToken(user,200,res,{
    id: user._id,
    name: user.name,
    userType: user.userType
 })
})

// --------- Protected Routes ------------
exports.protect = catchAsync(async (req,res,next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError('You are not logged in! PLease log in to get access.', 401))
  }
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_TOKEN_SECRET)
  req.user = await User.findById(decoded.id)
  next();
})

// ------------ Restrict To ---------------
exports.restrictTo = (...roles) => {
  return (req,res,next) => {
    if (!roles.includes(req.user.userType)) {
        return next(new AppError('You do not have permission to perform this action', 403))
    }
    next();
    }
}
