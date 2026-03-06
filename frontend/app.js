async function generateProject(){

const btn = document.getElementById("generateBtn")
btn.innerText="Generating..."
btn.classList.add("loading")

const language = document.getElementById("language").value
const cicd = document.getElementById("cicd").value
const docker = document.getElementById("docker").checked
const kubernetes = document.getElementById("kubernetes").checked

const url = `http://localhost:5000/generate?language=${language}&cicd=${cicd}&docker=${docker}&kubernetes=${kubernetes}`

window.location.href = url

}