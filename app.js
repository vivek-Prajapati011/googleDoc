// importing express
import express from "express"
import { createWriteStream, mkdir, rm } from "fs"


// importinf readdir
import { readdir, rename, stat } from "fs/promises"
import path from "path"

const app = express()


//setting port number
const port = 3000


app.use(express.json())

//enabling cores
app.use((req, res, next) => {
    res.set("Acess-Control-Allow-Origin", "*")
    res.set("Acess-Control-Method", "*")
    res.set("Acess-Control-Header", "*")
    next()
})




  





app.patch("/files/*", async (req,res) => {
    const filePath = path.join('/', req.params[0]) 
   await rename(`./storage/${filePath}`, `./storage/${req.body.newfileName}`)
   res.json({msg: "file rername sucessfully"})
})




// listening to the port
app.listen(port, () => {
console.log("server is started")
})
