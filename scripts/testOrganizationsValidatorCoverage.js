// insert default coverage provider
var Web3 = require('web3')
web3Provider = new Web3('ws://localhost:8555')

// import tests
var testOrganizationsValidator = require('./testOrganizationsValidator.js')

// run coverage tests
testOrganizationsValidator.test(web3Provider, 'coverage')