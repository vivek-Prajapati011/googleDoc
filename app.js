// importing express
import express from "express"

const app = express()
//setting port number
const port = 3000
// listening to the port
app.listen(port, () => {
console.log("server is started")
})
