//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

interface ISyntheticLootCharacterAssets {
    function itemSize() external view returns (uint256);
    function skeleton() external view returns (string memory);
    function weapon() external view returns (string memory);
    function chest() external view returns (string memory);
    function head() external view returns (string memory);
    function waist() external view returns (string memory);
    function foot() external view returns (string memory);
    function hand() external view returns (string memory);
    function neck() external view returns (string memory);
    function ring() external view returns (string memory);
}