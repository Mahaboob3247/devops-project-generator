function generateProject(){

const projectName = document.getElementById("projectName").value || "devops-project"
const language = document.getElementById("language").value
const cicd = document.getElementById("cicd").value
const docker = document.getElementById("docker").checked
const kubernetes = document.getElementById("kubernetes").checked
const terraform = document.getElementById("terraform").checked

const url = `http://localhost:5000/generate?project=${projectName}&language=${language}&cicd=${cicd}&docker=${docker}&kubernetes=${kubernetes}&terraform=${terraform}`

window.location.href = url

}