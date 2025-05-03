
import express from "express"
import { createWriteStream, rm } from "fs"
import {  rename } from "fs/promises"
import path from "path"

const route = express.Router()


// creating routes for uploading files 
route.post("/:filename", (req, res) => {
    const  filename  = req.params.filename
    const id = crypto.randomUUID()
    const extension = path.extname(filename)
    const fullFileName = `${id}${extension}`
    const writeStream = createWriteStream(`./storage/${fullFileName}`)
    req.pipe(writeStream)
    req.on("end", async () => {
      filesData.push({
        id,
        extension,
        name: filename
      })
      console.log(filesData);
      await writeFile('./filesDB.json', JSON.stringify(filesData))
      res.json({ message: "File Uploaded" });
    });
  });
  

// Path Traversal Vulnerability
route.get("/:id", (req, res) => {
    const {id} = req.params
    const fileData = filesData.find((file) => file.id === id)
    if (req.query.action === "download") {
      res.set("Content-Disposition", "attachment");
    }
    res.sendFile(`${process.cwd()}/storage/${id}${fileData.extension}`, (err) => {
      if (err) {
        res.json({ error: "File not found!" });
      }
    });
  });


// setting up dlt route
route.delete("/*", async (req,res) => {
    const filePath = path.join('/', req.params[0]) 
    try {
         await rm(`./storage/${filePath}`, { recursive: true });
        res.json({msg : "file deleted successfully"})
    } catch (error){
        res.status(404).json({msg : "file not found"})
    }

})


// creatin fouts to uplaod  file 
route.patch("/*", async (req,res) => {
    const filePath = path.join('/', req.params[0]) 
   await rename(`./storage/${filePath}`, `./storage/${req.body.newfileName}`)
   res.json({msg: "file rername sucessfully"})
})

export default route