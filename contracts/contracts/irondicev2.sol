
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/token/ERC20/IERC20.sol";



// Notes:
// Cipher Tag on Mumbai Address: 0xc69F4eF2138764A52e7dd7Ec2931d1CdD7B32d0f
// WMATIC contract address: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270

// TODO:
// Implement Chainlink, inherit and create random call and callback
// Implement Events
// Bets Array and Bets Length

contract IronDice is VRFConsumerBase, Ownable {
    IERC20 public nativeGameToken;
    mapping(address => UserBet) public userBets;
    mapping(bytes32 => address) public requestIdtoAddress;

    uint256 constant HOUSE_EDGE_PERCENT = 1;
    uint256 public totalBets = 0;
    uint256 public totalRewards = 0;
    uint256 public lastDiceRoll = 7;
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;


    // Add Mix/max bets and rewards

    struct UserBet {
        uint8 diceNumber; // Number 1 - 6
        uint256 amount;
        bool isBetPlaced;
        bool isSettled;
    }

    // EVENTS
    event PlacedBet(uint256 _diceNumber, uint256 _amount, bool isBetPlaced, bool isSettled);
    event DiceRolled(address indexed owner, uint256 playerNumber, uint256 houseRoll, uint256 winnings);

    // TODO invert the order of _diceNumber and _amount in the event

    /**
     * Initializes the contract with an address of an ERC-20 token
     */
    constructor(IERC20 _nativeGameToken)  VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK Token
        )  {
        // TODO: Complete this
        // Store _nativeGameToken to contracts Storage
        nativeGameToken = _nativeGameToken;
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10 ** 18; // 0.0001 LINK
    }

    /**
     * Allows a user to place a bet on a dice value using a specific ERC-20 token amount.
     * Returns the amount that was bet.
     */
    function placeBet(uint256 _amount, uint8 _diceNumber) external returns (uint256) {
        // TODO: Complete this
        // Ensure user has the balance and alloance to place this bet
        require(nativeGameToken.balanceOf(msg.sender) >= _amount, 'Not enough amount');
        require(nativeGameToken.allowance(msg.sender, address(this)) >= _amount, 'Not enough WMATIC allowance');
        //Get the address to fund the contract with the native token

        nativeGameToken.transferFrom(msg.sender, address(this), _amount);

        // Ensure that User has not placed a bet already (todo)

        // Ensure that thet betValue is between 1-6
        require(_diceNumber <= 6 && _diceNumber >= 1, 'out of bounds');

        // Create a new user bet for the sender
        // Add the bet to the bet array
        // Add the bet to the mapping

        userBets[msg.sender] = UserBet({diceNumber: _diceNumber, amount: _amount, isBetPlaced: true, isSettled: false});
        totalBets++;
        // Return the amount of the bet
        emit PlacedBet(_diceNumber, _amount, true, false);

        rollDice();
        return _amount;
    }

    /**
     * Returns whether the caller has already placed a bet.
     */
    function isBetPlaced() public view returns (bool) {
        // TODO: Complete this
        // Return True if bet from sender was placed, False otherwise
        return userBets[msg.sender].isBetPlaced;
    }

    /**
     * Rolls the dice and transfers the funds to the winner appropriately.
     * Returns a pair of values:
     *	(a) A boolean that indicates if the caller has won,
     *	(b) The roll of the dice.
     */
    function rollDice() internal  {
        // TODO: Complete this
        UserBet storage bet = userBets[msg.sender];
        // Ensure that sender has already placed a bet
        // Ensure that contract is able to send at least 6*betAmount Tokens on behalf of the user
        // Ensure that contract can send at least bet amount of Tokens on behalf of the sender
        require(isBetPlaced(), 'No Bet Placed');
        require(nativeGameToken.balanceOf(address(this)) > bet.amount * 6, 'Contract has no funds');
        // Toggle isBetPlaced for the sender's bet to False
        // Roll the dice
        bytes32 diceRollRequestId = getRandomNumber();
        requestIdtoAddress[diceRollRequestId] = msg.sender;

        //emit dice roll event

        // Check if sender has won.
        // if (diceRoll == bet.diceNumber) {
        //     uint256 winnings = reward - (reward * (HOUSE_EDGE_PERCENT / 100));
        //     nativeGameToken.transfer(msg.sender, winnings);
        //     totalRewards += winnings;
        // }
        // If won send tokens bet amount*6 from owner to ender
        // Otherwise send bet amount of tokens from sender to owner
        // Return if the sender has won or not and the roll of the dice
        // rtValue = diceRoll == bet.diceNumber;
        // return (rtValue, _amount);
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
          randomResult = randomness % 6 + 1;
          settleBet(randomResult,requestId);
    }


    function settleBet(uint256 randomRoll, bytes32 requestId) internal {
        address owner = requestIdtoAddress[requestId];
        UserBet storage bet = userBets[owner];
        bet.isSettled = true;
        bet.isBetPlaced = false;

        if (randomRoll == bet.diceNumber) {
            uint256 reward = bet.amount * 6;
            uint256 winnings = reward - (reward * (HOUSE_EDGE_PERCENT / 100));
            nativeGameToken.transfer(owner, winnings);
            totalRewards += winnings;
            emit DiceRolled(owner, bet.diceNumber, randomRoll, winnings);
        } else {
            emit DiceRolled(owner, bet.diceNumber, randomRoll, 0);

        }
        lastDiceRoll = randomRoll;


    }

    function withdrawNativeGameToken(uint256 amount) public onlyOwner {
        require(nativeGameToken.balanceOf(address(this)) >= amount, 'Not enough tokens');
        nativeGameToken.transfer(msg.sender, amount);
    }

    function setNativeToken(IERC20 newTokenAddress) public onlyOwner{
        nativeGameToken = newTokenAddress;
    }
}
