// importing express
import express from "express"
// importinf readdir
import { readdir } from "fs/promises"

const app = express()
//setting port number
const port = 3000
// enabling cores
app.use((req,res, next) => {
    res.set("Acess-Control-Allow-Origin", "*")
    next()
})

app.use( (req, res, next) => {
    if (req.query.action === "download") { 
        res.set("Content-Dispostion", "attachment")
        
    }
     // enabling static files
    express.static("storage")(req, res, next)
} )  

// setting dynamic routes
app.get("/:fileName", (req,res) => {
    const fileName = req.params.fileName
    res.sendFile(`${import.meta.dirname}/storage/${fileName}`)
})

// setting up routes
app.get ("/", async (req, res) => {
    const fileName = await readdir("./storage")
    console.log(fileName)
    res.send("hello")
})
// listening to the port
app.listen(port, () => {
console.log("server is started")
})
