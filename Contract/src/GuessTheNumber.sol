pragma solidity ^0.8.0;

contract GuessTheNumber {
    uint256 private _secretNumber;
    address public owner;
    uint256 public minBet = 1 ether;
    uint256 public maxBet = 5 ether;

    event GameWon(address indexed winner, uint256 reward);
    event GameStarted(address indexed player, uint256 bet);
    event GameLost(address indexed player, uint256 secretNumber);

    constructor() payable {
        owner = msg.sender;
        generateNewSecretNumber();
    }
    
    modifier isValidBet(uint256 bet) {
        require(bet >= minBet && bet <= maxBet, "Bet is not within the allowed range.");
        _;
    }

    function startGame(uint256 betAmount, uint256 number1, uint256 number2, uint256 number3) public payable isValidBet(betAmount) {
    require(msg.value >= betAmount, "Insufficient bet amount");

    emit GameStarted(msg.sender, betAmount);

    if (number1 == _secretNumber || number2 == _secretNumber || number3 == _secretNumber) {
    uint256 reward = betAmount * 2;
    require(address(this).balance >= reward, "Not enough balance to pay the reward");
    sendReward(payable(msg.sender), reward);
    emit GameWon(msg.sender, reward);
} else {
    emit GameLost(msg.sender, _secretNumber);
}
    generateNewSecretNumber();
}




    function sendReward(address payable recipient, uint256 reward) internal {
        (bool sent, ) = recipient.call{value: reward}("");
        require(sent, "Failed to send Ether");
    }

    function generateNewSecretNumber() internal {
        _secretNumber = (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10) + 1; // set a random number between 1 and 10
    }

    function secretNumber() public view returns (uint256) {
        return _secretNumber;
    }
}
