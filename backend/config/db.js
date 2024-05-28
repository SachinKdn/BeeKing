const uri = "mongodb+srv://sachincse2020:BeeKingCloud4me@cluster0.gryoy0b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoose = require("mongoose");


const connectDatabase = ()=>{

    mongoose.connect(uri).then((data)=>{
    console.log("Mongodb connected with server " + data.connection.host)
    })
    // .catch((err)=>{
    //     console.log(err.message +  "   erro!!!");
    // }) //now we don't need of this because I handle this in server.js file using unhandlesRejection event state
}

module.exports = connectDatabase;