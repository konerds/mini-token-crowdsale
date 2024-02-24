require('dotenv').config({ path: '../.env' });

const Token = artifacts.require('KonerdToken');
const KYCVerify = artifacts.require('KYCVerify');
const Crowdsale = artifacts.require('KonerdTokenCrowdsale');

const chai = require('./setup-chai');
const BN = web3.utils.BN;

const expect = chai.expect;

contract('Crowdsale Test', async (accounts) => {
    const [deployerAccount, _, __] = accounts;

    it('should not have any tokens in account of deployer', async () => {
        let tokenInstance = await Token.deployed();
        await expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it('should have all tokens in the crowdsale contract by default', async () => {
        let tokenInstance = await Token.deployed();
        let totalSupply = await tokenInstance.totalSupply();
        let balanceOfCrowdsaleContract = await tokenInstance.balanceOf(Crowdsale.address);
        expect(balanceOfCrowdsaleContract).to.be.a.bignumber.equal(totalSupply);
    });

    it('should be possible to buy tokens', async () => {
        let tokenInstance = await Token.deployed();
        let crowdsaleInstance = await Crowdsale.deployed();
        let kycVerifyInstance = await KYCVerify.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        await kycVerifyInstance.setToCompleted(deployerAccount, { from: deployerAccount });
        await expect(crowdsaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei('1', 'wei') }))
            .to.be.fulfilled;
        await expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(
            balanceBefore.add(new BN(1))
        );
    });
});
