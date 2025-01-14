// This script can be used in Remix to register UAVs for the BSGAKAIoD contract.
// It calls the "registerUAV" function multiple times: first for an LU, then for several MUs.
// Right-click on this file in Remix -> "Run" to execute. Shortcut: Ctrl+Shift+S

import { ethers } from 'ethers';

(async () => {
  try {
    console.log("=== Start registering UAVs ===");

    const artifactsPath = 'browser/contracts/artifacts/BSGAKAIoD.json';
    const metadata = JSON.parse(
      await window.remix.call('fileManager', 'getFile', artifactsPath)
    );

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    const signer = provider.getSigner(0);  // GCS
    console.log(`Using signer: ${await signer.getAddress()}`);

    const contractAddress = "0x38cB7800C3Fddb8dda074C1c650A155154924C73";
    const contract = new ethers.Contract(contractAddress, metadata.abi, signer);
    const LUaddress = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";
    const MUaddresses = [
      "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
      "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
      "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
      "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",
      "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678",
      "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7",
      "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C",
      "0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC"
    ];
    console.log(`Registering LU UAV: ${LUaddress}`);
    let tx = await contract.registerUAV(LUaddress, 0); // 0 => UAVType.LU
    await tx.wait(); // 等待上链
    console.log("LU UAV registered successfully!");
    for (let i = 0; i < MUaddresses.length; i++) {
      const muAddr = MUaddresses[i];
      console.log(`Registering MU UAV #${i + 1}: ${muAddr}`);
      tx = await contract.registerUAV(muAddr, 1); // 1 => UAVType.MU
      await tx.wait(); // 等待上链
      console.log(`MU UAV #${i + 1} registered!`);
    }

    console.log("\n=== All UAVs have been registered successfully! ===");
  } catch (e) {
    console.error("Error during registration:", e.message);
  }
})();
