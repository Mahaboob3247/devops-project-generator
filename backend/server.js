const express = require("express")
const cors = require("cors")

const generateProject = require("./generator")

const app = express()

app.use(cors())

// Root API
app.get("/", (req,res)=>{
  res.send("DevOps Generator API Running")
})


// ADD YOUR GENERATE API HERE
app.get("/generate", async (req,res)=>{

const options = {
language: req.query.language,
cicd: req.query.cicd,
docker: req.query.docker === "true",
kubernetes: req.query.kubernetes === "true"
}

await generateProject(options)

res.send("Project Generated Successfully")

})


// Start server
app.listen(5000, ()=>{
console.log("Server running on port 5000")
})