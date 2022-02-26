//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@rari-capital/solmate/src/tokens/ERC721.sol";

abstract contract ClaimableSynthetic is ERC721 {

  uint256 public immutable claimPrice = 0.02 ether;
  // address public immutable withdrawAddress; // TODO: Withdrawal
  // address immutable ensReverseAddress;
  string public constant claimMessage = "Message to claim";
  mapping(address => bool) public claimed;

  function claim() public payable {
    require(msg.value >= claimPrice, "Insufficient payment");
    _safeMint(msg.sender, getTokenID(msg.sender));
    claimed[msg.sender] = true;
    uint256 refund = msg.value - claimPrice;
    if (refund > 0) {
      payable(msg.sender).transfer(refund);
    }
  }

  function claimOther(address _signer, bytes memory _signature) public payable {
    require(msg.value >= claimPrice, "Insufficient payment");
    require(verify(_signer, claimMessage, _signature), "Invalid signature");

    _safeMint(msg.sender, getTokenID(_signer));
    claimed[_signer] = true;
    uint256 refund = msg.value - claimPrice;
    if (refund > 0) {
      payable(_signer).transfer(refund);
    }
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

  // ECDSA

  function getMessageHash(
    string memory _message
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(_message));
  }

  function getEthSignedMessageHash(bytes32 _messageHash)
    public
    pure 
    returns (bytes32)
  {
    return
      keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
      );
  }

  function verify(
    address _signer,
    string memory _message,
    bytes memory signature
  ) public pure returns (bool) {
    bytes32 messageHash = getMessageHash(_message);
    bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

    return recoverSigner(ethSignedMessageHash, signature) == _signer;
  }

  function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
    public
    pure
    returns (address)
  {
    (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

    return ecrecover(_ethSignedMessageHash, v, r, s);
  }

  function splitSignature(bytes memory sig)
    public
    pure
    returns (
        bytes32 r,
        bytes32 s,
        uint8 v
    )
  {
    require(sig.length == 65, "invalid signature length");

    assembly {
      // first 32 bytes, after the length prefix
      r := mload(add(sig, 32))
      // second 32 bytes
      s := mload(add(sig, 64))
      // final byte (first byte of the next 32 bytes)
      v := byte(0, mload(add(sig, 96)))
    }
  }
}