pragma solidity 0.6.2;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MinterRole.sol";

abstract contract ERC20Mintable is ERC20, MinterRole {
    function mint(
        address account,
        uint256 amount
    ) public onlyMinter returns (bool) {
        _mint(account, amount);
        return true;
    }
}
