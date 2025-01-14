// verifyRemovedUAV.js
// This script queries the registration status of a UAV in the BSGAKAIoD contract 
// after it has presumably been removed (isRegistered = false).
// Right-click on this file in Remix -> "Run" to execute. Shortcut: Ctrl+Shift+S

import { ethers } from 'ethers';

(async () => {
  try {
    console.log("=== Start verifying removed UAV status ===");

    const artifactsPath = 'browser/contracts/artifacts/BSGAKAIoD.json'; 
    const metadata = JSON.parse(
      await window.remix.call('fileManager', 'getFile', artifactsPath)
    );
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAddress = "0x3328358128832A260C76A4141e19E2A943CD4B6D";
    const contract = new ethers.Contract(contractAddress, metadata.abi, signer);

    const removedUAVAddress = "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678";
    console.log(`Querying registration status of UAV: ${removedUAVAddress} ...`);
    
    const uavInfo = await contract.registeredUAVs(removedUAVAddress);
    
    const uavType = uavInfo.uavType.toString(); 
    const isRegistered = uavInfo.isRegistered;

    console.log("=== UAV Info ===");
    console.log(`uavType: ${uavType} (0=LU, 1=MU)`);
    console.log(`isRegistered: ${isRegistered}`);

    if (!isRegistered) {
      console.log("The UAV is no longer registered (has been successfully removed)."); 
    } else {
      console.log("The UAV is still registered. (Removal might have failed or not called.)");
    }

    console.log("=== Verification completed! ===");
  } catch (e) {
    console.error("Error during verification of removed UAV:", e.message);
  }
})();
