pragma solidity 0.6.2;

import "./ERC20Mintable.sol";

contract KonerdToken is ERC20Mintable {
    // constructor(uint256 initialSupply) public ERC20("Konerd Token", "KNT") {
    //     _setupDecimals(0);
    //     _mint(msg.sender, initialSupply);
    // }

    constructor() public ERC20("Konerd Token", "KNT") {
        _setupDecimals(0);
    }
}
