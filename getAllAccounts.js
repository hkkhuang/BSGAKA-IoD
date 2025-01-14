// Get all accounts and assign addresses for GCS, LU, and MU_i
(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("=== Accounts in Remix VM (Cancun) ===");
  for (let i = 0; i < accounts.length; i++) {
    let prefix;
    if (i === 0) {
      prefix = "GCS";
    } else if (i === 1) {
      prefix = "LU";
    } else {
      prefix = `MU_${i - 1}`; 
    }
    console.log(`${i + 1}. ${prefix} address: ${accounts[i]}`);
  }
})();

