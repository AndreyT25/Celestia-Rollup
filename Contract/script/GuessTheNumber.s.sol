// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {GuessTheNumber} from "src/GuessTheNumber.sol";

contract GuessTheNumberScript is Script {
    function setUp() public {}

    function run() public {
        console.log("Starting broadcast");
        vm.startBroadcast();
        
        console.log("Deploying GuessTheNumber contract");
        GuessTheNumber gtn = (new GuessTheNumber){value: 1000000 ether}();
        
        console.log("Stopping broadcast");
        vm.stopBroadcast();
        
        console.log("Emitting Deployment event");
        emit Deployment(address(gtn));
    }

    event Deployment(address indexed deployedAddress);
}

