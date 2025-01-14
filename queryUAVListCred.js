// This script is for a UAV to call "queryUAVListCred" on the BSGAKAIoD contract.
// The UAV account must be already registered (onlyRegisteredUAV).
// Right-click on this file in Remix -> "Run" to execute. Shortcut: Ctrl+Shift+S

import { ethers } from 'ethers';

(async () => {
  try {
    console.log("=== Start querying UAVListCred ===");
    const artifactsPath = 'browser/contracts/artifacts/BSGAKAIoD.json';
    const metadata = JSON.parse(
      await window.remix.call('fileManager', 'getFile', artifactsPath)
    );
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    const targetUAVAddress = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2".toLowerCase();
    const signerIndex = accounts.findIndex(acc => acc.toLowerCase() === targetUAVAddress);

    if (signerIndex === -1) {
      throw new Error(`UAV address ${targetUAVAddress} not found in the provider's account list.
Make sure this UAV is in the current environment's accounts, or switch to the correct environment.`);
    }

    console.log(`Using UAV signer at index ${signerIndex}: ${accounts[signerIndex]}`);
    const signer = provider.getSigner(signerIndex);
    const contractAddress = "0x3328358128832A260C76A4141e19E2A943CD4B6D";
    const contract = new ethers.Contract(contractAddress, metadata.abi, signer);
    const SN = "SN2024122810085697";
    console.log(`Querying credential list for SN = "${SN}" ...`);
    const [C, S, uavsData] = await contract.queryCredentialList(SN);

    console.log("=== UAVListCred Query Result ===");
    console.log("PUF Challenge (C):", C);
    console.log("Secret Hash (S):   ", S);
    console.log(`Number of UAV_Cred items: ${uavsData.length}`);
    uavsData.forEach((uavCred, index) => {
      console.log(`  [${index}] PID = ${uavCred.PID}, PUF = ${uavCred.PUF}`);
    });
    console.log("=== UAVListCred query completed! ===");

  } catch (e) {
    console.error("Error during credential list query:", e.message);
  }
})();
