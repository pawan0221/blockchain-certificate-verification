async function main() {
  const Certificate = await ethers.getContractFactory("CertificateVerification");
  const certificate = await Certificate.deploy();
  await certificate.waitForDeployment();

  console.log("Certificate contract deployed to:", await certificate.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});