import { ethers } from 'hardhat';

const main = async () => {
    const [owner, randomPerson] = await ethers.getSigners();
    const waveContractFactory = await ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log(`Deployed to ${waveContract.address}`);
    console.log(`Deployed by ${owner.address}`);

    let waveCount = await waveContract.getTotalWaves();

    const waveTransaction = await waveContract.wave();

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

runMain();