// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/math/SafeMath.sol";

contract ClaimingToken is ERC20, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 private constant FixedSupply = 21_000_000_000 * 10 ** 18; // Fixed supply of 21 billion tokens
    uint256 public constant MaxClaimAmount = 500 * 10 ** 18; // Users can claim a maximum of 500 tokens
    uint256 public constant TransactionFee = 5;

    mapping(address => bool) public hasClaimed;
    mapping(address => bool) public _holder;
    address[] private tokenHolders;

    constructor() ERC20("ClaimingToken", "CLMT") {
        _mint(address(this), FixedSupply); // Tokens  mint
    }

    function claimTokens() external nonReentrant {
        require(msg.sender != address(0), "zero address are not allowed");
        require(!hasClaimed[msg.sender], "You have already claimed tokens");
        uint256 contractBalance = balanceOf(address(this));
        require(contractBalance > 0, "All tokens have been claimed");

        uint256 claimAmount = MaxClaimAmount;

        if (contractBalance < MaxClaimAmount) {
            claimAmount = contractBalance;
        }

        hasClaimed[msg.sender] = true;
        transferToken(address(this), msg.sender, claimAmount);
        TokenHolder(msg.sender);
    }

    function transferToken(address from, address to, uint256 amount) internal {
        uint256 fee = (amount.mul(TransactionFee)).div(100);
        uint256 amountAfterFee = amount.sub(fee);

        super._transfer(from, to, amountAfterFee); // 5% transaction fee for every token transfer.
        if (fee > 0) {
            distributeFee(fee); // Distribute the fee back to token holders .
        }

        TokenHolder(to);
    }

    function distributeFee(uint256 fee) private {
        uint256 totalSupply = totalSupply().sub(balanceOf(address(this)));

        for (uint256 i = 0; i < tokenHolders.length; i++) {
            address holder = tokenHolders[i];

            uint256 holderBalance = balanceOf(holder);

            if (holderBalance > 0) {
                uint256 holderShare = fee.mul(holderBalance).div(totalSupply);
                super._transfer(address(this), holder, holderShare);
            }
        }
    }

    function noOfClaimUser() public view returns (uint256) {
        return tokenHolders.length; // Total no. of claim users
    }

    function TokenHolder(address account) private {
        if (!_holder[account]) {
            _holder[account] = true;
            tokenHolders.push(account);
        }
    }
}
