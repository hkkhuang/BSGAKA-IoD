// This script can be used to deploy the "BSGAKAIoD" contract using ethers.js library.
// Please make sure to compile "./contracts/BSGAKAIoD.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S


import { deploy } from './ethers-lib'

(async () => {
  try {
    const contract = await deploy('BSGAKAIoD', [])
    console.log(`Contract deployed at address: ${contract.address}`)

    const deployTx = contract.deployTransaction
    console.log(`Deployment transaction hash: ${deployTx.hash}`)
    console.log(`Deployed by (from): ${deployTx.from}`)
    
    const receipt = await deployTx.wait()
    console.log(`Block number: ${receipt.blockNumber}`)
    console.log(`Gas used: ${receipt.gasUsed.toString()}`)
    
  } catch (e) {
    console.log(e.message)
  }
})()
