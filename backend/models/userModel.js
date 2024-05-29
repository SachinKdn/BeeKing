const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const crypto = require('crypto')//ye built in h install nhi krna pdta


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Username is required."],
        maxLength:[30,"Username is too long."],
        minLength:[2,"Username is too small."]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,    
        required:[true,"Please Enter Your Password"],
        minLength:[6,"Name should have more than 6 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    resetPasswordToken: String,
    resetPasswordExpire:Date,
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})


userSchema.methods.getToken = function(){   
    console.log("Token created for id:- "+this._id)
    return jwt.sign({id:this._id},"process.env.JWT_SECRET"
        ,{
            expiresIn:process.env.JWT_EXPIRE,//ye jwt token itne din mein expire hoyega i.e. itne din baad aapko re-login krna pdega
    }
    )
}

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    console.log("Your Saved token is : " + this.resetPasswordToken)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    console.log("Your final token is : " + resetToken)
    return resetToken;//ab nodemailer ka use krke mail bhjne ki tyari krenge 
}



module.exports = mongoose.model("User",userSchema)
