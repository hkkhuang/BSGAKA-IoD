// This script updates the credential list by calling "updateCredentialList" function of the BSGAKAIoD contract.
// Right-click on this file in Remix -> "Run" to execute. Shortcut: Ctrl+Shift+S

import { ethers } from 'ethers';

(async () => {
  try {
    console.log("=== Start updating UAVListCred ===");
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

    const SN = "SN2024122810085697"; 
    const C = "0xChallengeForAllUAVPUF1234567890abcdef"; 
    const S = "0xSecretHashValue1234567890abcdef"; 
    const uavData = [
      { PID: "0xPIDForLUabcdef123456", PUF: "0xLUPUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU1abcdef123456", PUF: "0xUMU1PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU2abcdef123456", PUF: "0xUMU2PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU3abcdef123456", PUF: "0xUMU3PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU4abcdef123456", PUF: "0xUMU4PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU5abcdef123456", PUF: "0xUMU5PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU6abcdef123456", PUF: "0xUMU6PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU7abcdef123456", PUF: "0xUMU7PUFSecretValue1234567890abcdef" },
      { PID: "0xPIDForMU8abcdef123456", PUF: "0xUMU8PUFSecretValue1234567890abcdef" },
      
    ];

    console.log("Updating UAVListCred with parameters:");
    console.log("SN:", SN);
    console.log("C:", C);
    console.log("S:", S);
    console.log("uavData:", uavData);

    const tx = await contract.updateCredentialList(SN, C, S, uavData);
    console.log("Transaction sent, waiting for confirmation...");
    const receipt = await tx.wait();

    console.log("updateUAVListCred transaction confirmed!");
    console.log("Transaction hash:", receipt.transactionHash);
    console.log("Block number:", receipt.blockNumber);

    console.log("=== UAVListCred update completed! ===");
  } catch (e) {
    console.error("Error during update UAVListCred:", e.message);
  }
})();
