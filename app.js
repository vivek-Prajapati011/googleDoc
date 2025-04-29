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

app.post("/directory/?*", async (res,req) => {
    const dirname = path.join('/', req.params[0]) 
    try {
        await mkdir(`./storage/${dirname}`);
        res.json({ message: "Directory Created!" });
      } catch (err) {
        res.json({ err: err.message });
      }
})

// creating routes for uploading files 
app.post("/files/*", (req,res) => { 
    const filePath = path.join('/', req.params[0])  
    const writeStram = createWriteStream(`./storage/${filePath}`)
    req.pipe(writeStram)
    req.on("end", () => {
        res.json({msg : "file uploaded sucessfully"})
    })
})
  

// setting dynamic routes
app.get("/files/*", (req,res) => { 
  const filePath = path.join('/', req.params[0]) // getting the file name from the url
    if ( req.query.params === "download") { 
        res.set("Content-Dispositon", "attachment") // setting the content disposition to attchment 
    }
    res.sendFile(`${import.meta.dirname}/storage/${filePath}`, (err) => {
        if (err){
            res.json({msg : "file not found"})
        }
    }) // sending the file to the client 
})

// setting up dlt route
app.delete("/files/*", async (req,res) => {
    const filePath = path.join('/', req.params[0]) 
    try {
         await rm(`./storage/${filePath}`, { recursive: true });
        res.json({msg : "file deleted successfully"})
    } catch (error){
        res.status(404).json({msg : "file not found"})
    }

})

app.patch("/files/*", async (req,res) => {
    const filePath = path.join('/', req.params[0]) 
   await rename(`./storage/${filePath}`, `./storage/${req.body.newfileName}`)
   res.json({msg: "file rername sucessfully"})
})



// setting up routes
app.get ("/directory/?*", async (req, res) => { // optional routing
    const dirname = path.join('/', req.params[0]) 
    console.log(dirname)
    const fullDirpathh = `./storage/${dirname? dirname : ""}`
   try {
    const FileList = await readdir(fullDirpathh)
    // filtering the files and directories
    const resData = []  
    for( const items of FileList){ 
        const stats = await stat(`${fullDirpathh}/${items}`)
        resData.push({name: items, isDirectory: stats.isDirectory()})

    }
    res.json(resData) 
   } catch (error) { 
    res.json({error: error.message})
   }
})
// listening to the port
app.listen(port, () => {
console.log("server is started")
})
