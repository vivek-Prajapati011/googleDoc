// importing express
import express from "express"

const app = express()
//setting port number
const port = 3000
// enabling cores
app.use((req,res, next) => {
    res.set("Acess-Control-Allow-Origin", "*")
})
// setting up routes
// listening to the port
app.listen(port, () => {
console.log("server is started")
})
