const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("DevOps Project Generator API Running");
});

app.get("/generate", async (req, res) => {

  const projectPath = path.join(__dirname, "generated-project");

  try {

    await fs.remove(projectPath);

    await fs.ensureDir(projectPath + "/app");

    await fs.writeFile(
      projectPath + "/app/app.js",
      `console.log("Hello DevOps Project");`
    );

    await fs.writeFile(
      projectPath + "/Dockerfile",
      `FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node","app/app.js"]`
    );

    await fs.writeFile(
      projectPath + "/Jenkinsfile",
      `pipeline {
  agent any
  stages {
    stage('Build'){
      steps{
        echo "Building Project"
      }
    }
  }
}`
    );

    await fs.writeFile(
      projectPath + "/README.md",
      `# DevOps Generated Project`
    );

    const zipPath = path.join(__dirname, "project.zip");

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      res.download(zipPath);
    });

    archive.pipe(output);
    archive.directory(projectPath, false);
    archive.finalize();

  } catch (error) {

    console.error(error);
    res.status(500).send("Error generating project");

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});