pragma solidity 0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCVerify is Ownable {
    mapping(address => bool) public allowances;

    function setToCompleted(address _address) public onlyOwner {
        allowances[_address] = true;
    }

    function setToUncompleted(address _address) public onlyOwner {
        allowances[_address] = false;
    }

    function getIsCompleted(address _address) public view returns (bool) {
        return allowances[_address];
    }
}
