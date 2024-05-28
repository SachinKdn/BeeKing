const express = require("express")

const app = express();
app.use(express.json());//It parses incoming requests with JSON payloads and is based on body-parser. 



app.get("/",(req,res)=>{
    res.send("Started !!!")
})

module.exports = app;