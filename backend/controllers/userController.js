const User = require("../models/userModel");
const sendToken = require("../utils/sendToken");


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

