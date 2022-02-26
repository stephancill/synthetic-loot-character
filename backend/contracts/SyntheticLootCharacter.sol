//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./abstract/ClaimableSynthetic.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./external/SyntheticLoot.sol";
import "./interfaces/ISyntheticLootCharacterAssets.sol";

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
    ISyntheticLootCharacterAssets assets;
    string[] gateways;

    constructor (string memory _name, string memory _symbol, address _syntheticLootAddress, address _syntheticLootCharacterAssetsAddress) ERC721(_name, _symbol) {
        syntheticLoot = SyntheticLoot(_syntheticLootAddress);
        assets = ISyntheticLootCharacterAssets(_syntheticLootCharacterAssetsAddress);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        address walletAddress = getAddress(tokenId);

        // TODO: Render all components, only getting names for now
        string memory svg = string.concat(
            '<svg viewBox="0 0 50 50" width="1000" xmlns="http://www.w3.org/2000/svg">',
            getDefs(), 
            getCharacter(walletAddress), 
            '</svg>'
        );

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag 0x', toAsciiString(walletAddress), '", "description": "Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    function getSpritesheetElement(string memory _id, string memory _imageData) internal pure returns (string memory) {
        return string.concat('<svg width="50" height="50" viewBox="100 0 50 50"><image id="', _id, '" preserveAspectRatio="xMinYMin slice" href="', _imageData, '" /></svg>');
    }

    function getDefs() internal view returns (string memory) {
        return string.concat(
            '<defs>',
            getStyle(),
            getSpritesheetElement("skeleton", assets.skeleton()),
            getSpritesheetElement("weapon", assets.weapon()),
            getSpritesheetElement("chest", assets.chest()),
            getSpritesheetElement("head", assets.head()),
            getSpritesheetElement("waist", assets.waist()),
            getSpritesheetElement("foot", assets.foot()),
            getSpritesheetElement("hand", assets.hand()),
            getSpritesheetElement("neck", assets.neck()),
            getSpritesheetElement("ring", assets.ring()) , 
            '</defs>'
        );
    }

    function getStyle() internal pure returns (string memory) {
        return '<style> #character { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; } svg { background : #1A1A1A; } </style>';
    }

    function getItemElement(string memory _id, string memory _spritesheetId) internal pure returns (string memory) {
        return string.concat(
            '<svg width="50" height="50" viewBox="', _id, ' 0 50 50">', 
            '<use href="#', _spritesheetId, '"></use>',
            '</svg>'
        );
    }

    function getCharacter(address walletAddress) internal view returns (string memory) {
        return string.concat(
            '<svg id="character">',
            getItemElement("0", "skeleton"),
            getItemElement(Strings.toString(syntheticLoot.weaponComponents(walletAddress)[0]*assets.itemSize()), "weapon"),
            getItemElement(Strings.toString(syntheticLoot.chestComponents(walletAddress)[0]*assets.itemSize()), "chest"),
            getItemElement(Strings.toString(syntheticLoot.headComponents(walletAddress)[0]*assets.itemSize()), "head"),
            getItemElement(Strings.toString(syntheticLoot.waistComponents(walletAddress)[0]*assets.itemSize()), "waist"),
            getItemElement(Strings.toString(syntheticLoot.footComponents(walletAddress)[0]*assets.itemSize()), "foot"),
            getItemElement(Strings.toString(syntheticLoot.handComponents(walletAddress)[0]*assets.itemSize()), "hand"),
            getItemElement(Strings.toString(syntheticLoot.neckComponents(walletAddress)[0]*assets.itemSize()), "neck"),
            getItemElement(Strings.toString(syntheticLoot.ringComponents(walletAddress)[0]*assets.itemSize()), "ring"),
            '</svg>'
        );
    }

    /*
    *   Utils
    */

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