const fs = require("fs-extra")

async function generateProject(options){

const projectPath = "../generated-project"

await fs.remove(projectPath)
await fs.mkdir(projectPath)

if(options.language === "node"){

await fs.writeFile(
projectPath + "/app.js",
`const express = require("express")
const app = express()

app.get("/", (req,res)=>{
res.send("Hello DevOps World")
})

app.listen(3000)`
)

await fs.writeFile(
projectPath + "/package.json",
`{
"name":"devops-app",
"version":"1.0.0",
"dependencies":{
"express":"^4.18.2"
}
}`
)

}

if(options.docker){

await fs.writeFile(
projectPath + "/Dockerfile",
`FROM node:18

WORKDIR /app

COPY . .

RUN npm install

CMD ["node","app.js"]`
)

}

if(options.cicd === "github"){

await fs.mkdir(projectPath + "/.github/workflows")

await fs.writeFile(
projectPath + "/.github/workflows/ci.yml",
`name: CI Pipeline

on: [push]

jobs:
 build:
  runs-on: ubuntu-latest

  steps:
  - uses: actions/checkout@v3
  - run: npm install
  - run: node app.js`
)

}

if(options.kubernetes){

await fs.mkdir(projectPath + "/k8s")

await fs.writeFile(
projectPath + "/k8s/deployment.yaml",
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
     image: node:18`
)

}

}

module.exports = generateProject