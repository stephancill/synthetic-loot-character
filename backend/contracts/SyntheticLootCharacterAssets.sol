//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./interfaces/ISyntheticLootCharacterAssets.sol";

contract SyntheticLootCharacterAssets is ISyntheticLootCharacterAssets {
    uint256 public constant itemSize = 50;  
    string public constant skeleton = "";   // PREPROCESS CONSTANT: skeleton
    string public constant weapon = "";     // PREPROCESS CONSTANT: weapon
    string public constant chest = "";      // PREPROCESS CONSTANT: chest
    string public constant head = "";       // PREPROCESS CONSTANT: head
    string public constant waist = "";      // PREPROCESS CONSTANT: waist
    string public constant foot = "";       // PREPROCESS CONSTANT: foot
    string public constant hand = "";       // PREPROCESS CONSTANT: hand
    string public constant neck = "";       // PREPROCESS CONSTANT: neck
    string public constant ring = "";       // PREPROCESS CONSTANT: ring
}