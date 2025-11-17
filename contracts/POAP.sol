// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POAP is ERC721URIStorage, Ownable {

    uint256 public nextTokenId;
    mapping(address => bool) public hasClaimed;

    constructor()
        ERC721("EventPOAP", "EPOAP")
        Ownable(msg.sender)   // ✅ REQUIRED FOR OZ v5
    {}

    function mintPOAP(address attendee, string memory tokenURI_) external onlyOwner {
        require(!hasClaimed[attendee], "Already claimed");

        uint256 tokenId = nextTokenId;
        _safeMint(attendee, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        hasClaimed[attendee] = true;
        nextTokenId = tokenId + 1;
    }
}
