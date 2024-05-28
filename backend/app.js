const express = require("express")
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());//It parses incoming requests with JSON payloads and is based on body-parser. 
app.use(cookieParser());



const dotenv = require("dotenv");
dotenv.config({path:"./config/config.env"});


const user = require("./routes/userRoute")

app.use("/api/v1",user)


app.get("/",(req,res)=>{
    res.send("Started !!!")
})

module.exports = app;