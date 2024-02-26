pragma solidity 0.6.2;

import "./Crowdsale.sol";
import "./ERC20Mintable.sol";

abstract contract MintedCrowdsale is Crowdsale {
    function _deliverTokens(
        address beneficiary,
        uint256 tokenAmount
    ) internal override {
        require(
            ERC20Mintable(address(token())).mint(beneficiary, tokenAmount),
            "MintedCrowdsale: minting failed"
        );
    }
}
