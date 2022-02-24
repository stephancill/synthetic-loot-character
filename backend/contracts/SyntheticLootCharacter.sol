//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./external/SyntheticLoot.sol";

contract SyntheticLootCharacter is ERC721 {

    using Strings for string;

    string[8] renderOrder = [
        "weapon",
        "chest",
        "head",
        "waist",
        "foot",
        "hand",
        "neck",
        "ring"
    ];

    SyntheticLoot syntheticLoot;
    // TODO: Mutliple IPFS gateways, choose random based on block number
    string[] gateways;

    constructor (string memory _name, string memory _symbol, address _syntheticLootAddress, string[] memory _gateways) ERC721(_name, _symbol) {
        syntheticLoot = SyntheticLoot(_syntheticLootAddress);
        gateways = _gateways;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        address walletAddress = getAddress(tokenId);
        // uint[5][8] memory components = [
        //     syntheticLoot.weaponComponents(walletAddress),
        //     syntheticLoot.chestComponents(walletAddress),
        //     syntheticLoot.headComponents(walletAddress),
        //     syntheticLoot.waistComponents(walletAddress),
        //     syntheticLoot.footComponents(walletAddress),
        //     syntheticLoot.handComponents(walletAddress),
        //     syntheticLoot.neckComponents(walletAddress),
        //     syntheticLoot.ringComponents(walletAddress)
        // ];

        // TODO: Render all components, only getting names for now
        string[8] memory componentNames = [
            lowerUnderscore(syntheticLoot.getWeapon(walletAddress)),
            lowerUnderscore(syntheticLoot.getChest(walletAddress)),
            lowerUnderscore(syntheticLoot.getHead(walletAddress)),
            lowerUnderscore(syntheticLoot.getWaist(walletAddress)),
            lowerUnderscore(syntheticLoot.getFoot(walletAddress)),
            lowerUnderscore(syntheticLoot.getHand(walletAddress)),
            lowerUnderscore(syntheticLoot.getNeck(walletAddress)),
            lowerUnderscore(syntheticLoot.getRing(walletAddress))
        ];

        string memory svg = '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">';

        for (uint256 i = 0; i < componentNames.length; i++) {
            string memory url = string.concat(gateways[block.number % gateways.length], renderOrder[i], '/name/', componentNames[i], '.png');
            string memory image = string.concat('<image width="200" href="', url, '"/>');
            svg = string.concat(svg, image);
        }

        svg = string.concat(svg, '</svg>');

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag 0x', toAsciiString(walletAddress), '", "description": "Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    function _tokenURI(address _address) public view returns (string memory) {
        return tokenURI(getTokenID(_address));
    }

    function getTokenID(address _address) public pure returns (uint256) {
        return uint256(uint160(_address));
    }

    function getAddress(uint256 id) public pure returns (address) {
        return address(uint160(id));
    }

    /*
    *   Utils
    */

    function lowerUnderscore(string memory _base)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        for (uint i = 0; i < _baseBytes.length; i++) {
            _baseBytes[i] = _lowerUnderscore(_baseBytes[i]);
        }
        return string(_baseBytes);
    }

    function _lowerUnderscore(bytes1 _b1)
        private
        pure
        returns (bytes1) {

        if (_b1 == 0x20) {
            return bytes1(0x5f);
        }

        if (_b1 >= 0x41 && _b1 <= 0x5A) {
            return bytes1(uint8(_b1) + 32);
        }

        return _b1;
    }

    // https://ethereum.stackexchange.com/a/8447
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    // https://ethereum.stackexchange.com/a/8447
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    
}