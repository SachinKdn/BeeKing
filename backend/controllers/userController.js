const User = require("../models/userModel");
const sendToken = require("../utils/sendToken");
const crypto = require('crypto')//ye built in h install nhi krna pdta
const sendEmail = require("../utils/sendEmail");



exports.registerUser = async (req,res)=>{
    console.log(req.body);
    const newUser = await User.create(req.body);

    sendToken(newUser,201,res);
    

}

exports.loginUser = async (req,res)=>{
    const email = req.body.email;

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    }

    const isMatched = await user.comparePassword(req.body.password);

    if(!isMatched){
        return res.status(404).json({message:"Password Not Matched"})
    }

    sendToken(user,201,res);
}

exports.logout = async (req,res)=>{
    res.status(200).cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    }).json({
        success: true,
        message: "Logged Out Successfully"
    });
}


exports.forgotPassword = async(req,res)=>{
const email = req.body.email;
const user = await User.findOne({email});

if(!user){
    return res.send("User not found.")
}

const resetToken = user.getResetPasswordToken();
await user.save({validateBeforeSave: false});

const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
console.log(resetToken)
const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this mail then, please ignore it.`;


try{

    // ye ek sendEmail() bna diya jo call hoga taki NodeMailer package email send kr ske...
    await sendEmail({
        email:`${user.email}`,
        subject: "BeeKing Password Recovery",
        message
    });

    res.status(200).json({
        success:true,
        message:`Email successfully sent to ${user.email}`
    })
}catch(error){
    user.resetPasswordToken = undefined;//agar hmne inko undefined krdiya to ye DB se chli jati h na ki undefined contain krke rkhti h
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave: false});

    return res.send("Please try again")
}
}

exports.resetPassword = async(req,res)=>{
    const resetToken = req.params.token;
    console.log(resetToken);

    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : { $gt : Date.now()}
    })

    if(!user){
        return res.send("Your token is expired. Please try again !!")
    }

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password !== confirmPassword){
        return res.send("Password must be matched.")
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    if(user.password.length < 6){
        // return next(new ErrorHandler("Password should be bigger",400)) 
        return res.send("Password must be matched.")
    }
    await user.save();
    sendToken(user,200,res)
    
    // res.send("Password must be matched.")

}

