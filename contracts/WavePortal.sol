// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // Keep a count of the total waves
    uint256 private totalWaves = 0;

    struct Wave {
        address owner;
        uint256 amount;
        uint256 timestamp;
    }

    error InvalidWave(string);

    // Keep a list of all waves
    Wave[] private waves;

    function wave() public payable {
        totalWaves += 1;
        waves.push(Wave(msg.sender, msg.value, block.timestamp));
        console.log("%s has waved", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }

    function getWave(uint256 index)
        public
        view
        returns (
            address,
            uint256,
            uint256
        )
    {
        if (index >= totalWaves || index < 0) {
            revert InvalidWave("Invalid index");
        }
        Wave memory requestedWave = waves[index];
        return (
            requestedWave.owner,
            requestedWave.amount,
            requestedWave.timestamp
        );
    }
}
