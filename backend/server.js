const express = require("express")
const fs = require("fs-extra")
const archiver = require("archiver")
const path = require("path")

const app = express()

const GENERATED_DIR = path.join(__dirname, "generated")

app.get("/generate", async (req, res) => {

console.log(req.query)

const options = {
language: req.query.language || "node",
cicd: req.query.cicd,
docker: req.query.docker === "true",
kubernetes: req.query.kubernetes === "true",
terraform: req.query.terraform === "true"
}

const projectName = req.query.project || "devops-project"
const projectPath = path.join(GENERATED_DIR, projectName)
const appDir = path.join(projectPath,"app")
await fs.ensureDir(appDir)
await fs.remove(projectPath)
await fs.ensureDir(projectPath)


// =====================
// APPLICATION CODE
// =====================

if(options.language === "node"){

await fs.writeFile(
path.join(projectPath,"app.js"),

`const express = require("express")
const app = express()

app.get("/",(req,res)=>{
res.send("Node DevOps App Running")
})

app.listen(3000)`
)

}

if(options.language === "python"){

await fs.writeFile(
path.join(projectPath,"app.py"),

`from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
 return "Python DevOps App Running"

app.run(host="0.0.0.0",port=5000)`
)

}

if(options.language === "java"){

await fs.ensureDir(path.join(projectPath,"src"))

await fs.writeFile(
path.join(projectPath,"src","App.java"),

`public class App {
public static void main(String[] args){
System.out.println("Java DevOps App Running");
}
}`
)

}

if(options.language === "go"){

await fs.writeFile(
path.join(projectPath,"main.go"),

`package main
import "fmt"

func main(){
fmt.Println("Go DevOps App Running")
}`
)

}
await fs.writeFile(
path.join(projectPath,".gitignore"),

`node_modules
.env
dist
build
*.log`
)

await fs.writeFile(
path.join(projectPath,"README.md"),

`# ${projectName}

Generated using DevOps Project Generator

## Stack

Language: ${options.language}

CI/CD: ${options.cicd}

Docker: ${options.docker}

Kubernetes: ${options.kubernetes}

## Run

\`\`\`
docker build -t ${projectName} .
docker run -p 3000:3000 ${projectName}
\`\`\`
`
)

if(options.docker){

await fs.writeFile(
path.join(projectPath,"docker-compose.yml"),

`version: '3'

services:
 app:
  build: .
  ports:
   - "3000:3000"`
)

}
// =====================
// DOCKERFILE
// =====================

if(options.docker){

await fs.writeFile(
path.join(projectPath,"Dockerfile"),

`FROM node:20
WORKDIR /app
COPY . .
RUN npm install || true
EXPOSE 3000
CMD ["node","app.js"]`
)

}


// =====================
// CI/CD
// =====================

if(options.cicd === "jenkins"){

await fs.writeFile(
path.join(projectPath,"Jenkinsfile"),

`pipeline {
agent any

stages {

stage('Build'){
steps{
echo 'Building application'
}
}

stage('Test'){
steps{
echo 'Running tests'
}
}

stage('Deploy'){
steps{
echo 'Deploying application'
}
}

}
}`
)

}

if(options.cicd === "github"){

const workflowDir = path.join(projectPath,".github/workflows")

await fs.ensureDir(workflowDir)

await fs.writeFile(
path.join(workflowDir,"ci.yml"),

`name: CI

on:
 push:
  branches: [ main ]

jobs:
 build:

  runs-on: ubuntu-latest

  steps:
   - uses: actions/checkout@v3

   - name: Build
     run: echo "Building project"

   - name: Test
     run: echo "Running tests"`
)

}


// =====================
// KUBERNETES
// =====================

if(options.kubernetes){

const kubeDir = path.join(projectPath,"kubernetes")

await fs.ensureDir(kubeDir)

await fs.writeFile(
path.join(kubeDir,"deployment.yaml"),

`apiVersion: apps/v1
kind: Deployment
metadata:
 name: devops-app

spec:
 replicas: 2

 selector:
  matchLabels:
   app: devops-app

 template:
  metadata:
   labels:
    app: devops-app

  spec:
   containers:
   - name: devops-app
     image: devops-app:latest
     ports:
     - containerPort: 3000`
)

}


// =====================
// TERRAFORM
// =====================

if(options.terraform){

const tfDir = path.join(projectPath,"terraform")

await fs.ensureDir(tfDir)

await fs.writeFile(
path.join(tfDir,"main.tf"),

`provider "aws" {
 region = "us-east-1"
}

resource "aws_instance" "devops_server" {

 ami           = "ami-0c55b159cbfafe1f0"
 instance_type = "t2.micro"

 tags = {
  Name = "DevOpsGeneratedServer"
 }

}`
)

}


// =====================
// ZIP PROJECT
// =====================

const zipPath = path.join(GENERATED_DIR,"project.zip")

const output = fs.createWriteStream(zipPath)
const archive = archiver("zip",{zlib:{level:9}})

archive.pipe(output)
archive.directory(projectPath,false)
archive.finalize()

output.on("close",()=>{

console.log("Zip created:",archive.pointer(),"bytes")

res.download(zipPath,"devops-project.zip")

})

})


app.listen(5000,()=>{
console.log("Server running on port 5000")
})