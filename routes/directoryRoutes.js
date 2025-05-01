import express from "express"
import {  mkdir} from "fs"
// importing readdir
import { readdir,  stat } from "fs/promises"
import path from "path"

const app = express()

app.post("/directory/?*", async (res,req) => {
    const dirname = path.join('/', req.params[0]) 
    try {
        await mkdir(`./storage/${dirname}`);
        res.json({ message: "Directory Created!" });
      } catch (err) {
        res.json({ err: err.message });
      }
})

const route = express.Router()


// setting up routes for renaming files and directory
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

