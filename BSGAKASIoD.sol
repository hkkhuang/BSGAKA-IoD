// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BSGAKAIoD {
    address public admin_GCS;

    enum UAVType { LU, MU }

    struct UAV {
        UAVType uavType;  
        bool isRegistered;
    }

    struct UAV_Cred {
        string PID;
        string PUF;
    }

    struct CredentialList {
        string SN;            // session round number
        string C;             // PUF, input challenge
        string S;             // secret S Chebyshev mapping 
        UAV_Cred[] uavs_cred; // array
    }

    mapping(string => CredentialList) private credentials;
    mapping(address => UAV) public registeredUAVs;

    event UAVRegistered(address uavAddress, UAVType uavType);
    event CredentialListUpdated(string SN, string C, string S, uint256 uavCount);
    event UAVRemoved(address uavAddress, address removedBy);

    constructor() {
        admin_GCS = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin_GCS, "Only the administrator (GCS) can invoke this function!");
        _;
    }

    modifier onlyRegisteredUAV() {
        require(registeredUAVs[msg.sender].isRegistered, "Only registered UAVs can invoke this function!");
        _;
    }

    modifier onlyLU() {
        require(
            registeredUAVs[msg.sender].isRegistered && 
            registeredUAVs[msg.sender].uavType == UAVType.LU, 
            "Only the cluster leader UAV (LU) can  can invoke this function!"
        );
        _;
    }

 
    function registerUAV(
        address uavAddress,
        UAVType uavType
    ) 
        public 
        onlyAdmin 
    {
        require(
            !registeredUAVs[uavAddress].isRegistered, 
            "This UAV address is already registered"
        );

        registeredUAVs[uavAddress] = UAV({
            uavType: uavType,
            isRegistered: true
        });

        emit UAVRegistered(uavAddress, uavType);
    }

    /**
     * @dev LU remove/delete MU
     * @param memberUAVAddress
     */
    function removeUAV(address memberUAVAddress) 
        public 
        onlyLU 
    {
        require(registeredUAVs[memberUAVAddress].isRegistered, "UAV is not registered");
        require(registeredUAVs[memberUAVAddress].uavType == UAVType.MU, "Target UAV is not of type MU");

        delete registeredUAVs[memberUAVAddress];
        emit UAVRemoved(memberUAVAddress, msg.sender);
    }

 
    function updateCredentialList(
        string memory SN,
        string memory C,
        string memory S,
        UAV_Cred[] memory uavData
    ) 
        public 
    {
        require(
            msg.sender == admin_GCS || registeredUAVs[msg.sender].isRegistered,
            "Not authorized to update credential list"
        );

        CredentialList storage cred = credentials[SN];
        cred.SN = SN;
        cred.C = C;
        cred.S = S;

        delete cred.uavs_cred;

        for (uint256 i = 0; i < uavData.length; i++) {
            cred.uavs_cred.push(UAV_Cred({
                PID: uavData[i].PID,
                PUF: uavData[i].PUF
            }));
        }

        emit CredentialListUpdated(SN, C, S, uavData.length);
    }

    function queryCredentialList(string memory SN) 
        public 
        view 
        onlyRegisteredUAV 
        returns (
            string memory C,
            string memory S,
            UAV_Cred[] memory uavData
        ) 
    {
        CredentialList storage cred = credentials[SN];

        require(bytes(cred.SN).length != 0, "Credential list does not exist for the given SN");

        uint256 uavCount = cred.uavs_cred.length;
        uavData = new UAV_Cred[](uavCount);

        for (uint256 i = 0; i < uavCount; i++) {
            uavData[i] = cred.uavs_cred[i];
        }
        return (cred.C, cred.S, uavData);
    }
}
