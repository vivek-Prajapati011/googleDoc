// importing express
import express from "express"
import { createWriteStream, rm } from "fs"


// importinf readdir
import { readdir, rename } from "fs/promises"

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

// creating routes for uploading files
app.post("/files/:fileName", (req,res) => { 
    const writeStram = createWriteStream(`./storage/${req.params.fileName}`)
    req.pipe(writeStram)
    req.on("end", () => {
        res.json({msg : "file uploaded sucessfully"})
    })
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
    const fileName = req.params.fileName // getting the file name from the url
    if ( req.query.params === "download") { 
        res.set("Content-Dispositon", "attachment") // setting the content disposition to attchment 
    }
    res.sendFile(`${import.meta.dirname}/storage/${fileName}`) // sending the file to the client 
})

// setting up dlt route
app.delete("/:fileName", async (req,res) => {
    const fileName = req.params.fileName
    const filepath = `${import.meta.dirname}/storage/${fileName}`
    try {
         await rm(filepath)
        res.json({msg : "file deleted successfully"})
    } catch (error){
        res.status(404).json({msg : "file not found"})
    }

})

app.patch("/:fileName", async (req,res) => {
    const fileName = req.query.params.fileName
   await rename(`./storage/${fileName}`, `./storage/${req.body.newfileName}`)
   res.json({msg: "file rername sucessfully"})
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
