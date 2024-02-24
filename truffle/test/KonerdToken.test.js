require('dotenv').config({ path: '../.env' });

const Token = artifacts.require('KonerdToken');

const chai = require('./setup-chai');
const BN = web3.utils.BN;

const expect = chai.expect;

contract('Token Test', async (accounts) => {
    const [deployerAccount, recipient, _] = accounts;

    beforeEach(async () => {
        this.tokenInstance = await Token.new(process.env.INITIAL_SUPPLY || 1000000);
    });

    it('all tokens should be in my account', async () => {
        let instance = this.tokenInstance;
        let totalSupply = await instance.totalSupply();
        // let balance = await instance.balanceOf(deployerAccount);
        // assert.equal(balance.valueOf(), totalSupply.valueOf(), 'The balance was not the same');
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it('is possible to send tokens between accounts', async () => {
        let instance = this.tokenInstance;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        const sendTokens = 1;
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(
            totalSupply.sub(new BN(sendTokens))
        );
        await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it('is not possible to send more tokens than available in total', async () => {
        let instance = this.tokenInstance;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);
        await expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });
});
