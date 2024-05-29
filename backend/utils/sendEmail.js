const nodemailer = require("nodemailer");

const sendMail = async(options)=>{
// you can use email testing service ka like mailtry vgera but these are not good and efficient
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587, //default port for SMTP is 587 if secure is false for encrypted email transmission using SMTP secure (SMTPS)
        // port:465, //secure should be true for 465 port no. (NOT RECOMMANDED)
        secure:false,
        service : process.env.SMTP_SERVICE,
        auth : {
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }        
    });
    
    const mailOptions = {
        // from:process.env.SMTP_MAIL,
        from:`"Sachin Kadian" <${process.env.SMTP_MAIL}>`,// sender address
        to:"sklovelyjatt2018@gmail.com",// list of receivers
        // to:options.email,// list of receivers
        subject:options.subject,// Subject line
        text:options.message,// plain text body
       }

    const info = await transporter.sendMail(mailOptions);
    console.log("***Message sent: %s", info.messageId);
}

module.exports = sendMail;