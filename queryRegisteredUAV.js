// This script queries "registeredUAVs" from the BSGAKAIoD contract for multiple UAV addresses.
// It prints out the uavType and whether isRegistered == true or false.
// Right-click on this file in Remix -> "Run" to execute. Shortcut: Ctrl+Shift+S

import { ethers } from 'ethers';

(async () => {
  try {
    console.log("=== Start querying registered UAVs ===");
    const artifactsPath = 'browser/contracts/artifacts/BSGAKAIoD.json'; 
    const metadata = JSON.parse(
      await window.remix.call('fileManager', 'getFile', artifactsPath)
    );

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    const signer = provider.getSigner(0);  // GCS
    console.log(`Using signer: ${await signer.getAddress()}`);

    const contractAddress = "0x3328358128832A260C76A4141e19E2A943CD4B6D";

    const contract = new ethers.Contract(contractAddress, metadata.abi, signer);
    const UAVaddresses = [
      "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", // LU
      "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", // MU_1
      "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", // MU_2
      "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", // MU_3
      "0x583031D1113aD414F02576BD6afaBfb302140225", // Unregistered UAV
      "0xdD870fA1b7C4700F2BD7f44238821C26f7392148", // Unregistered UAV
    ];
    console.log(`Preparing to query ${UAVaddresses.length} UAV addresses...\n`);

    for (let i = 0; i < UAVaddresses.length; i++) {
      const address = UAVaddresses[i];
      console.log(`Querying UAV address: ${address}`);
      const uavInfo = await contract.registeredUAVs(address);
      const uavType = uavInfo.uavType.toString();
      const isRegistered = uavInfo.isRegistered;

      if (isRegistered) {
        const typeStr = (uavType === "0") ? "LU UAV" : "MU UAV";
        console.log(`=> UAV type: ${uavType} (${typeStr}), isRegistered: ${isRegistered}\n`);
      } else {
        console.log(`=> This UAV is not registered!\n`);
      }
    }
    console.log("=== UAV query finished! ===");
  } catch (e) {
    console.error("Error during UAV query:", e.message);
  }
})();
