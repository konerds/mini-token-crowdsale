pragma solidity 0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCVerify is Ownable {
    mapping(address => bool) public allowances;

    event KYCVerifyCompleted(address indexed account);
    event KYCVerifyUncompleted(address indexed account);

    function setToCompleted(address _address) public onlyOwner {
        allowances[_address] = true;
        emit KYCVerifyCompleted(_address);
    }

    function setToUncompleted(address _address) public onlyOwner {
        allowances[_address] = false;
        emit KYCVerifyUncompleted(_address);
    }

    function getIsCompleted(address _address) public view returns (bool) {
        return allowances[_address];
    }

    // This is dummy function.
    // In real world, this function will be implemented through some KYC provider service.
    function requestVerification() public {
        allowances[msg.sender] = true;
        emit KYCVerifyCompleted(msg.sender);
    }
}
