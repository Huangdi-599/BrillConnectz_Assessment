const User = require('../models/User');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailServices')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require("dotenv").config()
//const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.SignUp = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      phoneNumber,
      password,
      interests } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstname,
      lastname,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      interests,
      isEmailVerified: false,
      isPhoneNumberVerified: false,
    });
    //Email Confirmation
    const subject = 'Confirm Your Email';
    const frontendUrl = process.env.FRONTENDURL;
    const confirmPath = `/confirm-email/${user._id}`;
    const confirmUrl = `${frontendUrl}${confirmPath}`;
    const message = `
          <html>
          <head>
            <title>Email Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                text-align: center;
                text-decoration: none;
                outline: none;
                color: #fff;
                background-color: #007bff;
                border: none;
                border-radius: 15px;
                box-shadow: 0 9px #999;
              }

              .button:hover {background-color: #0056b3}

              .button:active {
                background-color: #0056b3;
                box-shadow: 0 5px #666;
                transform: translateY(4px);
              }
            </style>
          </head>
          <body>
            <h2>Email Confirmation</h2>
            <p>Hello,</p>
            <p>Thank you for registering with us. Please click the button below to confirm your email address and activate your account:</p>
            <a href="${confirmUrl}" class="button">Confirm Email</a>
            <p>If you did not create an account, no further action is required.</p>
            <p>Thank you,<br>Brill Team</p>
          </body>
          </html>
          `;
    await emailService.sendEmail({
      to: email,
      subject: subject,
      html: message
    });
    await user.save();
    return res.status(201).json({
      success: true,
      phoneNumber:user?.phoneNumber,
      msg: 'Account Created Successfully'
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      error
    });
  }
}

module.exports.Login = async (req, res, next) => {

  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: login }, { phoneNumber: login }]
    });

    if (!user) {
      return res.status(400).json({
        succes: false,
        msg: 'Invalid Credentials'
      })
    }

    if (!user.isEmailVerified) {
      return res.status(403).json(
        {
          success: false,
          code:418, 
          msg: 'Check your mail to verify your email.'
        });
    }
    if (!user.isPhoneNumberVerified) {
      return res.status(403).json(
        {
          success: false,
          code:419,
          msg:'Please verify phone number to login.'
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json(
        {
          succes: false,
          msg: 'Invalid Credentials'
        });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '1d' });
    user.token = token;
    await user.save();
    return res.status(201).json({
      success: true,
      user,
      msg: 'logged in Successfully'
    });
  } catch (error) {
    return res.status(500).json({
      error
    });
    next(error)
  }
}
module.exports.ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Email Not Found'
      })
    }
    // Generate password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiration on user model
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const frontendUrl = process.env.FRONTENDURL;
    const resetPath = `/reset-password/${resetToken}`;
    const resetUrl = `${frontendUrl}${resetPath}`;
    const message = `
    <html>
    <head>
      <title>Password Reset Request</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          outline: none;
          color: #ffff;
          background-color: #4CAF50;
          border: none;
          border-radius: 15px;
          box-shadow: 0 9px #999;
        }

        .button:hover {background-color: #3e8e41}

        .button:active {
          background-color: #3e8e41;
          box-shadow: 0 5px #666;
          transform: translateY(4px);
        }
      </style>
    </head>
    <body>
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>You are receiving this email because we received a password reset request for your account. If you did not request a password reset, please ignore this email or alert us.</p>
      <p>To reset your password, please click on the following link or paste it into your browser:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>This link is valid for 1 hour.</p>
      <p>If you have any issues or did not request this email, please contact us immediately.</p>
      <p>Thank you,<br>Your Team</p>
    </body>
    </html>
    `;

    await emailService.sendEmail({
      to: user.email,
      subject: 'Password reset token',
      html: message,
    });
    return res.status(200).json({
      success: true,
      msg: 'Reset Password Email Sent Sucessfully.Check your email for password reset instructions'
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      error
    });
  }
}
module.exports.ResetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken.toString())
      .digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now()}, 
    });
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }
    user.password = await bcrypt.hash(password, 12);
    // Clear reset token fields
    user.resetPasswordToken = "";
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.status(200).json({
      success: true,
      msg: 'Password has been reset successfully. You can now log in with the new password.'
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      error
    });
  }
}
module.exports.ConfirmEmail = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        msg: 'User not found'
      });
    }
    user.isEmailVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      user,
      msg: 'Email successfully verified!,'
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      error
    });
  }
}

module.exports.SendOtp = async (req, res, next) => {
  const phoneNumber = req.body?.phoneNumber
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(new Date().getTime() + 10 * 60000);
    const user = await User.findOneAndUpdate({  phoneNumber: phoneNumber  }, { $set: { otp: otp, otpExpires: otpExpires } }, { upsert: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User Not Found'
      })
    }
    await user.save();
    // try {
      // const message = await client.messages.create({
        // body: `Dear ${user.firstname || "customer"},
// 
        // Thank you for choosing our service! As part of our security measures, we have generated a one-time password (OTP) for you to complete the verification process for your account.
        // 
        // Your OTP is: ${otp}
        // 
        // Please enter this OTP in the designated field to verify your phone number. Please note that this OTP is valid for a limited time only. If you did not request this OTP, please disregard this message.
        // 
        // Thank you for your cooperation.
        // 
        // Best regards,
        // Brill`,
        // to: process.env.TWILIO_VERIFIED_PHONE_NUMBER, 
        //from: "VA3b67a8ea9f446914bb42211bb1dababd"
      // });
      // console.log(message);
    // } catch (error) {
      // console.error(error);
      // return res.status(500).json({
        // ...error,
        // msg: "Failed to send OTP"
      // });
    // }

    res.status(201).json({
      success: true,
      user,
      msg: 'OTP sent successfully.'
    });
  } catch (error) {
    res.status(500).json({
      error,
      msg:"Operation Failed"

    });
    next(error)
  }
}

module.exports.VerifyOtp = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User Not Found'
      })
    }
    const now = new Date();
    // Check if the OTP matches and is not expired
    if (user.otp === otp && user.otpExpires > now) {
      // Mark the phone number as verified
      await User.updateOne({ phoneNumber }, { $set: { isPhoneNumberVerified: true }, $unset: { otp: "", otpExpires: "" } });

      res.status(200).json({
        success: true,
        user,
        msg: 'Phone number verified successfully.'
      });
    } else {
      res.status(400).json({
        success: false,
        msg: 'Invalid or expired OTP.'
      })
    }
  } catch (error) {
    res.status(500).json({
      error
    });
    next(error)
  }
}

module.exports.ChangePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.userId

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        msg: 'User Not Found'
      })
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: 'Old password does not match.'
      }
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({
      success: true,
      msg: 'Password updated successfully.'
    });
  } catch (error) {
    res.status(500).json({
      error
    });
    next(error)
  }
}

module.exports.UpdateEmail = async (req,res,next)=>{
  try{
      const { email } = req.body;
      const userId = req.params.userId;
      const user = await User.findOneAndUpdate({_id:userId}, {
        email:email,
        isEmailVerified : false
      },
      {new:true});
      if(!user){
        return res.status(404).json({
          success:false,
          msg:'User Not Found'
        })
      }
      const subject = 'Confirm Your Email';
      const frontendUrl = process.env.FRONTENDURL;
      const confirmPath = `/confirm-email/${user._id}`;
      const confirmUrl = `${frontendUrl}${confirmPath}`;
      const message = `
          <html>
          <head>
            <title>Email Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                text-align: center;
                text-decoration: none;
                outline: none;
                color: #fff;
                background-color: #007bff;
                border: none;
                border-radius: 15px;
                box-shadow: 0 9px #999;
              }

              .button:hover {background-color: #0056b3}

              .button:active {
                background-color: #0056b3;
                box-shadow: 0 5px #666;
                transform: translateY(4px);
              }
            </style>
          </head>
          <body>
            <h2>Email Confirmation</h2>
            <p>Hello,</p>
            <p>Thank you for registering with us. Please click the button below to confirm your email address and activate your account:</p>
            <a href="${confirmUrl}" class="button">Confirm Email</a>
            <p>If you did not create an account, no further action is required.</p>
            <p>Thank you,<br>Brill Team</p>
          </body>
          </html>
          `;
      await emailService.sendEmail({
        to: email,
        subject: subject,
        html: message
      });
      await user.save();
      return res.status(201).json({
        success:true,
        msg:'Email updated successfully. Confirm your new Email'
      });
  }catch(error){
    next(error)

    return res.status(500).json({
      error
    });
  }
}
module.exports.UpdateUsername = async (req,res,next)=>{
  try{
      const { username } = req.body;
      const userId = req.params.userId;
      const user = await User.findOneAndUpdate({_id:userId}, {
        username:username
      },
      {new:true});
      if(!user){
        return res.status(404).json({
          success:false,
          msg:'User Not Found'
        })
      }
      return res.status(201).json({
        success:true,
        msg:'Username updated successfully.'
      });
  }catch(error){
    next(error)
    return res.status(500).json({
      error
    });
  }
}
module.exports.GetUser = async (req,res,next)=>{
  try{
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if(!user){
        return res.status(404).json({
          success:false,
          msg:'User Not Found'
        })
      }
      return res.status(201).json({
        success:true,
        user
      });
  }catch(error){
    next(error)
    return res.status(500).json({
      error
    });
  }
}


