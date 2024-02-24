pragma solidity 0.6.2;

import "./KYCVerify.sol";
import "./Crowdsale.sol";

contract KonerdTokenCrowdsale is Crowdsale {
    KYCVerify kyc;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        KYCVerify _kyc
    ) public Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 weiAmount
    ) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(
            kyc.getIsCompleted(msg.sender),
            "KYC not completed, purchase not allowed"
        );
    }
}
