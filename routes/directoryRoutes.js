app.post("/directory/?*", async (res,req) => {
    const dirname = path.join('/', req.params[0]) 
    try {
        await mkdir(`./storage/${dirname}`);
        res.json({ message: "Directory Created!" });
      } catch (err) {
        res.json({ err: err.message });
      }
})