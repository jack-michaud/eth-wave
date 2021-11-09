import chai, { expect } from "chai";
import { ethers } from "hardhat";

import chaiAsPromised from 'chai-as-promised';
import { hrtime } from "process";

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
    const waveContract = await waveContractFactory.deploy({ value: ethers.utils.parseEther("0.1") });
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
    const waveContract = await waveContractFactory.deploy({ value: ethers.utils.parseEther("0.1") });
    await waveContract.deployed();

    expect(await waveContract.getTotalWaves()).to.equal(0);

    expect((await waveContract.getAllWaves()).length).to.be.equal(0);

    let transaction = await waveContract.connect(randomPerson).wave();
    await transaction.wait();

    const waves = await waveContract.getAllWaves();
    expect(waves.length).to.be.equal(1);
    expect(waves[0].owner).to.be.equal(randomPerson.address);
  });

  it("pays out 0.0001 ether sometimes", async function () {
    // Nondeterministic. Kinda hard to test.
  });
  it("limits the amount of times a single person can wave", async function () {
    const [owner, randomPerson] = await ethers.getSigners();

    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({ value: ethers.utils.parseEther("0.1") });
    await waveContract.deployed();

    let transaction = await waveContract.connect(randomPerson).wave();
    await transaction.wait();

    expect(waveContract.connect(randomPerson).wave()).to.be.rejectedWith();
  });
});
