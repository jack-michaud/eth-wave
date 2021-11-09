// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() payable {
        console.log("Initialized WavePortal");
        seed = (block.difficulty + block.timestamp) % 100;
    }

    // Keep track of a random seed
    uint256 private seed;

    // Keep a count of the total waves
    uint256 private totalWaves = 0;

    struct Wave {
        address owner;
        uint256 timestamp;
        bool awarded;
    }

    event NewWave(address indexed sender, uint256 timestamp, bool awarded);

    error InvalidWave(string);

    // Keep a list of all waves
    Wave[] private waves;

    // Keep track of a user's last wave.
    mapping(address => uint256) public lastWavedAt;

    function wave() public payable {

        // make sure this user has not waved within 15 minutes.
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Cooldown: Wait 15 minutes");
        console.log("%s has waved", msg.sender);

        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        bool awarded = false;
        
        seed = (seed + (block.difficulty + block.timestamp)) % 100;
        // 25% chance of getting a reward!
        if (seed < 25) {
            awarded = true;
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw beyond contract balance"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to transfer money");

            console.log("%s has been rewarded!", msg.sender);
        }

        waves.push(Wave(msg.sender, block.timestamp, awarded));

        emit NewWave(msg.sender, block.timestamp, awarded);
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}
