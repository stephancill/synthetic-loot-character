//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./abstract/ClaimableSynthetic.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./external/SyntheticLoot.sol";

contract SyntheticLootCharacter is ClaimableSynthetic {

    using Strings for string;

    string[8] public renderOrder = [
        "weapon",
        "chest",
        "head",
        "waist",
        "foot",
        "hand",
        "neck",
        "ring"
    ];

    string public constant cid = "QmbcKUu71Jh64tuJ41fWaLj4XRSkp3umYfaRRpnbjMxeH3";

    SyntheticLoot syntheticLoot;
    string[] gateways;

    constructor (string memory _name, string memory _symbol, address _syntheticLootAddress, string[] memory _gateways) ERC721(_name, _symbol) {
        syntheticLoot = SyntheticLoot(_syntheticLootAddress);
        gateways = _gateways;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        address walletAddress = getAddress(tokenId);
        string memory gateway = gateways[block.number % gateways.length];
        

        // TODO: Render all components, only getting names for now
        uint[8] memory componentNames = getComponentFilenames(walletAddress);

        string memory svg = '<svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">';

        svg = string.concat(svg, '<image width="500" href="', gateway, cid, '/bg.png', '"/>');
        svg = string.concat(svg, '<image width="500" href="', gateway, cid, '/fg.png', '"/>');

        for (uint256 i = 0; i < componentNames.length; i++) {
            string memory url = string.concat(gateway, cid, '/', renderOrder[i], '/name/', Strings.toString(componentNames[i]), '.png');
            string memory image = string.concat('<image width="500" href="', url, '"/>');
            svg = string.concat(svg, image);
        }

        svg = string.concat(svg, '</svg>');

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag 0x', toAsciiString(walletAddress), '", "description": "Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    function getComponentFilenames(address walletAddress) public view returns (uint[8] memory) {
        // return [
        //     processName(syntheticLoot.getWeapon(walletAddress)),
        //     processName(syntheticLoot.getChest(walletAddress)),
        //     processName(syntheticLoot.getHead(walletAddress)),
        //     processName(syntheticLoot.getWaist(walletAddress)),
        //     processName(syntheticLoot.getFoot(walletAddress)),
        //     processName(syntheticLoot.getHand(walletAddress)),
        //     processName(syntheticLoot.getNeck(walletAddress)),
        //     processName(syntheticLoot.getRing(walletAddress))
        // ];
        return [
            syntheticLoot.weaponComponents(walletAddress)[0],
            syntheticLoot.chestComponents(walletAddress)[0],
            syntheticLoot.headComponents(walletAddress)[0],
            syntheticLoot.waistComponents(walletAddress)[0],
            syntheticLoot.footComponents(walletAddress)[0],
            syntheticLoot.handComponents(walletAddress)[0],
            syntheticLoot.neckComponents(walletAddress)[0],
            syntheticLoot.ringComponents(walletAddress)[0]
        ];
    }

    /*
    *   Utils
    */
    function processName(string memory _base) internal pure returns (string memory) {
        bytes memory base = bytes(_base);
        bytes memory out;
        for (uint256 i = 0; i < base.length; i++) {
            if (base[i] != 0x22) {
                out = bytes.concat(out, _lowerUnderscore(base[i]));
            }
        }
        return string(out);
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