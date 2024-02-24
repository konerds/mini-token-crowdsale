'use strict';

var chai = require('chai');
const chaiBN = require('chai-bn')(web3.utils.BN);

chai.use(chaiBN);

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

module.exports = chai;
