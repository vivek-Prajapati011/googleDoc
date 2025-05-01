// creating routes for uploading files 
app.post("/files/*", (req,res) => { 
    const filePath = path.join('/', req.params[0])  
    const writeStram = createWriteStream(`./storage/${filePath}`)
    req.pipe(writeStram)
    req.on("end", () => {
        res.json({msg : "file uploaded sucessfully"})
    })
})