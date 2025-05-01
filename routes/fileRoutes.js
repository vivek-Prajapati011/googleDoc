
import express from "express"
import { createWriteStream, rm } from "fs"
import {  rename } from "fs/promises"
import path from "path"

const app = express()


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


// creatin fouts to uplaod  file 
app.patch("/files/*", async (req,res) => {
    const filePath = path.join('/', req.params[0]) 
   await rename(`./storage/${filePath}`, `./storage/${req.body.newfileName}`)
   res.json({msg: "file rername sucessfully"})
})
