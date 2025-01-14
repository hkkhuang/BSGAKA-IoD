// This script is used in Remix to call "removeUAV" function of the BSGAKAIoD contract.
// The caller (signer) must be an LU UAV, and the target must be an MU UAV.
// Right-click on this file in Remix -> "Run" to execute. Shortcut: Ctrl+Shift+S

import { ethers } from 'ethers';

(async () => {
  try {
    console.log("=== Start removing MU UAV by LU ===");
    const artifactsPath = 'browser/contracts/artifacts/BSGAKAIoD.json';
    const metadata = JSON.parse(
      await window.remix.call('fileManager', 'getFile', artifactsPath)
    );

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const luAddress = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2".toLowerCase();
    const luIndex = accounts.findIndex(acc => acc.toLowerCase() === luAddress);

    if (luIndex === -1) {
      throw new Error(`LU address ${luAddress} not found in the provider's account list.
Make sure this LU is in the current environment's accounts.`);
    }
    console.log(`Using LU UAV signer at index ${luIndex}: ${accounts[luIndex]}`);

    const signer = provider.getSigner(luIndex);
    const contractAddress = "0x3328358128832A260C76A4141e19E2A943CD4B6D";

    const contract = new ethers.Contract(contractAddress, metadata.abi, signer);
    const muAddressToRemove = "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678";
    console.log(`Removing MU UAV: ${muAddressToRemove}`);

    const tx = await contract.removeUAV(muAddressToRemove);
    console.log("Transaction sent, waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("removeUAV transaction confirmed!");

    console.log("Transaction hash:", receipt.transactionHash);
    console.log("Block number:", receipt.blockNumber);

    console.log("=== MU UAV removal completed! ===");

  } catch (e) {
    console.error("Error during removeUAV:", e.message);
  }
})();
