pragma solidity 0.6.2;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KonerdToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Konerd Token", "KNT") {
        _mint(msg.sender, initialSupply);
    }
}
