pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Crowdsale is Context, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private _token;
    address payable private _wallet;
    uint256 private _rate;
    uint256 private _weiRaised;

    event TokensPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    constructor(uint256 rate, address payable wallet, IERC20 token) public {
        require(rate > 0, "Crowdsale: rate is 0");
        require(wallet != address(0), "Crowdsale: wallet is the zero address");
        require(
            address(token) != address(0),
            "Crowdsale: token is the zero address"
        );
        _rate = rate;
        _wallet = wallet;
        _token = token;
    }

    receive() external payable {
        buyTokens(_msgSender());
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function wallet() public view returns (address payable) {
        return _wallet;
    }

    function rate() public view returns (uint256) {
        return _rate;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    function buyTokens(address beneficiary) public payable nonReentrant {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(beneficiary, weiAmount);
        uint256 tokens = _getTokenAmount(weiAmount);
        _weiRaised = _weiRaised.add(weiAmount);
        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);
        _updatePurchasingState(beneficiary, weiAmount);
        _forwardFunds();
        _postValidatePurchase(beneficiary, weiAmount);
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 weiAmount
    ) internal view virtual {
        require(
            beneficiary != address(0),
            "Crowdsale: beneficiary is the zero address"
        );
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        this;
    }

    function _postValidatePurchase(
        address beneficiary,
        uint256 weiAmount
    ) internal view virtual {
        // solhint-disable-previous-line no-empty-blocks
    }

    function _deliverTokens(
        address beneficiary,
        uint256 tokenAmount
    ) internal virtual {
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    function _processPurchase(
        address beneficiary,
        uint256 tokenAmount
    ) internal virtual {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _updatePurchasingState(
        address beneficiary,
        uint256 weiAmount
    ) internal virtual {
        // solhint-disable-previous-line no-empty-blocks
    }

    function _getTokenAmount(
        uint256 weiAmount
    ) internal view returns (uint256) {
        return weiAmount.mul(_rate);
    }

    function _forwardFunds() internal virtual {
        _wallet.transfer(msg.value);
    }
}
