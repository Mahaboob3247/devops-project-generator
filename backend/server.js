const express = require("express")
const cors = require("cors")
const fs = require("fs-extra")
const path = require("path")
const archiver = require("archiver")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 5000


/* Home Route */

app.get("/", (req, res) => {

res.send("DevOps Project Generator API Running")

})


/* Generate Project */

app.get("/generate", async (req, res) => {

const language = req.query.language
const cicd = req.query.cicd

const projectPath = path.join(__dirname,"generated-project")

await fs.remove(projectPath)
await fs.ensureDir(projectPath)


// Language Template

if(language === "node"){

await fs.ensureDir(projectPath+"/app")

await fs.writeFile(
projectPath+"/app/app.js",
`console.log("Node DevOps Project")`
)

}

if(language === "python"){

await fs.ensureDir(projectPath+"/app")

await fs.writeFile(
projectPath+"/app/app.py",
`print("Python DevOps Project")`
)

}


// CI/CD Template

if(cicd === "github"){

await fs.ensureDir(projectPath+"/.github/workflows")

await fs.writeFile(
projectPath+"/.github/workflows/ci.yml",
`name: CI
on: [push]

jobs:
 build:
  runs-on: ubuntu-latest
  steps:
   - uses: actions/checkout@v3`
)

}

if(cicd === "jenkins"){

await fs.writeFile(
projectPath+"/Jenkinsfile",
`pipeline {
 agent any
 stages {
  stage('Build'){
   steps{
    echo "Build running"
   }
  }
 }
}`
)

}


// Create ZIP

const zipPath = path.join(__dirname,"project.zip")

const output = fs.createWriteStream(zipPath)
const archive = archiver("zip",{zlib:{level:9}})

output.on("close",()=>{

res.download(zipPath)

})

archive.pipe(output)

archive.directory(projectPath,false)

archive.finalize()

})



app.listen(PORT, () => {

console.log(`Server running on port ${PORT}`)

})