var KonerdToken = artifacts.require('KonerdToken');
var KonerdTokenCrowdsale = artifacts.require('KonerdTokenCrowdsale');
var KYCVerify = artifacts.require('KYCVerify');

require('dotenv').config({ path: '../.env' });

module.exports = async function (deployer) {
    const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY || 1000000;
    let address = await web3.eth.getAccounts();
    await deployer.deploy(KonerdToken, INITIAL_SUPPLY);
    await deployer.deploy(KYCVerify);
    await deployer.deploy(KonerdTokenCrowdsale, 1, address[0], KonerdToken.address, KYCVerify.address);
    let instance = await KonerdToken.deployed();
    await instance.transfer(KonerdTokenCrowdsale.address, INITIAL_SUPPLY);
};
