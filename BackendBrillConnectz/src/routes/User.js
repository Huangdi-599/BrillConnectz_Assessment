const express = require('express');
const { SignUp, Login, ForgotPassword, ResetPassword, ConfirmEmail, 
    SendOtp ,UpdateEmail, UpdateUsername, ChangePassword, GetUser, VerifyOtp} = require('../controller/User');
const verifyToken = require('../services/checkAuth');
const router = express.Router();

//Routes 
router.get('/confirm/:userId', ConfirmEmail)
router.post('/register',SignUp)
router.post('/login', Login)
router.post('/forgotpass', ForgotPassword)
router.put('/resetPassword/:resetToken', ResetPassword)
router.put('/update/email/:userId',verifyToken ,UpdateEmail)
router.put('/update/username/:userId',verifyToken ,UpdateUsername)
router.put('/update/password/:userId',verifyToken ,ChangePassword)
router.get('/user/:userId',verifyToken, GetUser)
router.post('/otp/send', SendOtp)
router.post('/otp/verify', VerifyOtp)



module.exports = router;