import chai, { expect } from "chai";
import { ethers } from "hardhat";

import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);


describe("WavePortal", function () {
  it("can initialize", async function () {
    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();
  });

  it("initializes as 0 waves and increments by 1 after a wave", async function () {
    const [owner, randomPerson] = await ethers.getSigners();

    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    expect(await waveContract.getTotalWaves()).to.equal(0);

    let waveTransaction = await waveContract.wave();
    await waveTransaction.wait();

    expect(await waveContract.getTotalWaves()).to.equal(1);

    waveTransaction = await waveContract.connect(randomPerson).wave();
    await waveTransaction.wait();

    expect(await waveContract.getTotalWaves()).to.equal(2);
  });

  it("stores the wave", async function () {
    const [owner, randomPerson] = await ethers.getSigners();

    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    expect(await waveContract.getTotalWaves()).to.equal(0);

    // Should throw because this is an invalid index.
    expect(waveContract.getWave(0)).to.be.rejectedWith();

    let transaction = await waveContract.connect(randomPerson).wave();
    await transaction.wait();

    const [ownerAddress, amount, timestamp] = await waveContract.getWave(0);

    expect(ownerAddress).to.be.equal(randomPerson.address);
    expect(amount).to.be.equal(0);
  });
});
