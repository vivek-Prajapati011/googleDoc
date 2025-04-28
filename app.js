// importing express
import express from "express"
import { createWriteStream, rm } from "fs"


// importinf readdir
import { readdir, rename, stat } from "fs/promises"

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
app.get("/files/:fileName", (req,res) => { 
    const fileName = req.params.fileName // getting the file name from the url
    if ( req.query.params === "download") { 
        res.set("Content-Dispositon", "attachment") // setting the content disposition to attchment 
    }
    res.sendFile(`${import.meta.dirname}/storage/${fileName}`) // sending the file to the client 
})

// setting up dlt route
app.delete("/files/:fileName", async (req,res) => {
    const fileName = req.params.fileName
    const filepath = `${import.meta.dirname}/storage/${fileName}`
    try {
         await rm(filepath)
        res.json({msg : "file deleted successfully"})
    } catch (error){
        res.status(404).json({msg : "file not found"})
    }

})

app.patch("/files/:fileName", async (req,res) => {
    const fileName = req.query.params.fileName
   await rename(`./storage/${fileName}`, `./storage/${req.body.newfileName}`)
   res.json({msg: "file rername sucessfully"})
})



// setting up routes
app.get ("/directory/:dirname?", async (req, res) => { // optional routing
    const dirname = req.params.dirname
    console.log(dirname)
    const fullDirpath = `./storage/${dirname? dirname : ""}`
    const fileName = await readdir(fullDirpath)
    // filtering the files and directories
    const resData = []  
    for( const items of fileName){ 
        const stats = await stat(`/storage/${items}`)
        resData.push({name: items, isDirectory: stats.isDirectory()})

    }
    res.json(resData)
})
// listening to the port
app.listen(port, () => {
console.log("server is started")
})
