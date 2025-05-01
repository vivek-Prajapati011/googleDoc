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