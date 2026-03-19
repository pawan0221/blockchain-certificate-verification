const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
 "function issueCertificate(string,string,string,string)",
 "function verifyCertificate(string) view returns(string,string,string,uint256)"
];

let provider;
let signer;
let contract;

let verifiedCount = 0;
let issuedCertificates = [];

async function connect(){

 if(!window.ethereum){
  alert("Install MetaMask");
  return;
 }

 provider = new ethers.providers.Web3Provider(window.ethereum);

 await provider.send("eth_requestAccounts", []);

 signer = provider.getSigner();

 contract = new ethers.Contract(contractAddress, abi, signer);

}



async function issueCertificate(){

 await connect();

 const id = document.getElementById("certId").value.trim();
 const name = document.getElementById("name").value.trim();
 const course = document.getElementById("course").value.trim();
 const grade = document.getElementById("grade").value.trim();

 const box = document.getElementById("issue-result");

 if(!id || !name || !course || !grade){

  box.className = "result-box result-invalid";
  box.style.display = "block";

  box.innerHTML = `
  <div class="result-title rtitle-invalid">
  All fields required
  </div>`;

  return;

 }

 try{

  const tx = await contract.issueCertificate(id,name,course,grade);

  await tx.wait();

  issuedCertificates.push({
   id:id,
   name:name,
   course:course,
   grade:grade,
   time:new Date()
  });

  renderChain();

  box.className = "result-box result-valid";
  box.style.display = "block";

  box.innerHTML = `

  <div class="result-title rtitle-valid">
  Certificate Issued
  </div>

  <div class="result-grid">

  <span class="rk">ID</span>
  <span class="rv">${id}</span>

  <span class="rk">Student</span>
  <span class="rv">${name}</span>

  <span class="rk">Course</span>
  <span class="rv">${course}</span>

  <span class="rk">Grade</span>
  <span class="rv">${grade}</span>

  </div>`;

  document.getElementById("certId").value="";
  document.getElementById("name").value="";
  document.getElementById("course").value="";
  document.getElementById("grade").value="";

 }

 catch(error){

  console.error(error);

  box.className = "result-box result-invalid";
  box.style.display = "block";

  box.innerHTML = `
  <div class="result-title rtitle-invalid">
  Transaction Failed
  </div>`;

 }

}



async function verifyCertificate(){

 await connect();

 const id = document.getElementById("verifyId").value.trim();

 const box = document.getElementById("verify-result");

 if(!id){

  box.className = "result-box result-invalid";
  box.style.display = "block";

  box.innerHTML = `
  <div class="result-title rtitle-invalid">
  Enter Certificate ID
  </div>`;

  return;

 }

 try{

  const data = await contract.verifyCertificate(id);

  verifiedCount++;

  document.getElementById("s-verified").textContent = verifiedCount;

  const date = new Date(data[3] * 1000);

  box.className = "result-box result-valid";
  box.style.display = "block";

  box.innerHTML = `

  <div class="result-title rtitle-valid">
  Certificate Verified
  </div>

  <div class="result-grid">

  <span class="rk">Student</span>
  <span class="rv">${data[0]}</span>

  <span class="rk">Course</span>
  <span class="rv">${data[1]}</span>

  <span class="rk">Grade</span>
  <span class="rv">${data[2]}</span>

  <span class="rk">Issued</span>
  <span class="rv">${date.toLocaleDateString()}</span>

  </div>`;

 }

 catch(error){

  console.error(error);

  box.className = "result-box result-invalid";
  box.style.display = "block";

  box.innerHTML = `
  <div class="result-title rtitle-invalid">
  Certificate Not Found
  </div>`;

 }

}



function renderChain(){

 const container = document.getElementById("chain-view");

 container.innerHTML = "";

 if(issuedCertificates.length === 0){

  container.innerHTML = `
  <div class="chain-empty">
  No certificates issued yet
  </div>`;

  return;

 }

 issuedCertificates.slice().reverse().forEach((cert,index)=>{

  const block = document.createElement("div");

  block.className = "block-card";

  block.innerHTML = `

  <div class="block-top">
  <span class="block-badge bb-regular">
  Block #${issuedCertificates.length-index}
  </span>
  </div>

  <div class="block-grid">

  <div>
  <div class="bf-label">Student</div>
  <div class="bf-val">${cert.name}</div>
  </div>

  <div>
  <div class="bf-label">Grade</div>
  <div class="bf-val">${cert.grade}</div>
  </div>

  <div>
  <div class="bf-label">Course</div>
  <div class="bf-val">${cert.course}</div>
  </div>

  <div>
  <div class="bf-label">Certificate ID</div>
  <div class="bf-val">${cert.id}</div>
  </div>

  </div>

  <div class="prev-hash">
  Issued: ${cert.time.toLocaleString()}
  </div>

  `;

  container.appendChild(block);

 });

}