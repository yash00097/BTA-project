// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPOAP {
    function mintPOAP(address attendee) external;
}

contract EventManager {
    IPOAP public poap;
    mapping(address => bool) public attended;

    struct Certificate {
        uint256 eventId;
        uint256 timestamp;
        string ens;
    }

    mapping(address => Certificate) public certificates;

    event AttendanceConfirmed(address indexed attendee, string ens, uint256 timestamp);

    constructor(address _poap) {
        poap = IPOAP(_poap);
    }

    function confirmAttendance(string memory ens) external {
        require(!attended[msg.sender], "Already confirmed");
        attended[msg.sender] = true;

        // Mint POAP
        poap.mintPOAP(msg.sender);

        // ✅ Store certificate data
        certificates[msg.sender] = Certificate({
            eventId: 1,
            timestamp: block.timestamp,
            ens: ens
        });

        emit AttendanceConfirmed(msg.sender, ens, block.timestamp);
    }

    // ✅ New getter
    function getCertificate(address user)
        external
        view
        returns (uint256 eventId, uint256 timestamp, string memory ens)
    {
        Certificate memory cert = certificates[user];
        return (cert.eventId, cert.timestamp, cert.ens);
    }
}
