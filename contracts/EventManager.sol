// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPOAP {
    function mintPOAP(address attendee, string memory tokenURI) external;
}

contract EventManager is Ownable {
    IPOAP public poap;

    mapping(address => bool) public attended;

    struct Certificate {
        uint256 eventId;
        uint256 timestamp;
        string ens;
    }
    mapping(address => Certificate) public certificates;

    string public eventMetadataURI;

    event AttendanceConfirmed(address indexed attendee, string ens, uint256 timestamp);
    event EventMetadataUpdated(string newURI);

    constructor(address _poap, string memory _metadataURI)
        Ownable(msg.sender)   // REQUIRED FOR OZ v5
    {
        poap = IPOAP(_poap);
        eventMetadataURI = _metadataURI;
    }

    function setEventMetadataURI(string memory _uri) external onlyOwner {
        eventMetadataURI = _uri;
        emit EventMetadataUpdated(_uri);
    }

    function confirmAttendance(string memory ens) external {
        require(!attended[msg.sender], "Already confirmed");
        attended[msg.sender] = true;

        poap.mintPOAP(msg.sender, eventMetadataURI);

        certificates[msg.sender] = Certificate({
            eventId: 1,
            timestamp: block.timestamp,
            ens: ens
        });

        emit AttendanceConfirmed(msg.sender, ens, block.timestamp);
    }

    function getCertificate(address user)
        external
        view
        returns (uint256 eventId, uint256 timestamp, string memory ens)
    {
        Certificate memory cert = certificates[user];
        return (cert.eventId, cert.timestamp, cert.ens);
    }
}
