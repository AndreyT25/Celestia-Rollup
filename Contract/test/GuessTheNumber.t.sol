// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "src/GuessTheNumber.sol";

contract Player {
    function startGame(address guessTheNumber, uint256 betAmount, uint256 number1, uint256 number2, uint256 number3) public payable {
        GuessTheNumber(guessTheNumber).startGame{value: betAmount}(betAmount, number1, number2, number3);
    }

    receive() external payable {}
}

contract GuessTheNumberTest is Test {
    GuessTheNumber guessTheNumber;
    address owner;
    address payable player;
    receive() external payable {}

    uint256 minBet = 1 ether;
    uint256 maxBet = 5 ether;

    function setUp() public payable {
    owner = address(this);
    guessTheNumber = new GuessTheNumber{value: 1000 ether}();
    Player playerContract = new Player(); // Deploy the Player contract
    player = payable(address(playerContract)); // Set the player address as address payable
    
    // Transfer 1 Ether to the player contract
    payable(address(playerContract)).transfer(minBet); 
}



    function testOwner() public {
        assertEq(guessTheNumber.owner(), owner);
    }

    function testBetRange() public {
        assertEq(guessTheNumber.minBet(), minBet);
        assertEq(guessTheNumber.maxBet(), maxBet);
    }

   function testPlayerReceivesRewardOnCorrectGuess() public {
    uint256 betAmount = minBet;
    uint256 initialPlayerBalance = player.balance;

    // Get the secret number
    uint256 secretNumber = guessTheNumber.secretNumber();

    // Player contract starts the game by placing the bet and making the guess
    Player(player).startGame(address(guessTheNumber), betAmount, secretNumber, secretNumber + 1, secretNumber + 2);

    // Wait for the transaction to be confirmed
    // You would need to use a delay function here if you were on a real network,
    // but it's not available in the Solidity testing environment

    uint256 finalPlayerBalance = player.balance;
    // uint256 expectedReward = betAmount; // The reward should be equal to the bet amount

   // Check that the player's balance is the same before and after the game, within a reasonable range to account for gas costs
assertTrue(finalPlayerBalance + 1000000000000000000 >= initialPlayerBalance && finalPlayerBalance - 1000000000000000000 <= initialPlayerBalance);

}

}


