// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POAP is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasClaimed;

    constructor() ERC721("EventPOAP", "EPOAP") Ownable(msg.sender) {}

    function mintPOAP(address attendee) external onlyOwner {
        require(!hasClaimed[attendee], "Already claimed");
        _safeMint(attendee, nextTokenId);
        nextTokenId++;
        hasClaimed[attendee] = true;
    }
}