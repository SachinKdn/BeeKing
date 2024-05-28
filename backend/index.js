const connectDatabase = require("./config/db")
const app = require("./app")



// connect with db
connectDatabase()




const server = app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})

