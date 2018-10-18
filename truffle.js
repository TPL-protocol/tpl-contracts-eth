var Web3 = require('web3')

module.exports = {
  networks: {
    development: {
      provider: new Web3('ws://localhost:8545'),
      network_id: "*", // Match any network id
      gasPrice: 10 ** 9,
      gas: 6000000
    },
    local: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6000000,
      gasPrice: 2e9, // 2 Gwei
    },
    ropsten: {
      host: 'localhost',
      port: 8565,
      network_id: 3,
      gas: 500000,
      gasPrice: 10e9, // 10 Gwei
    },
    rinkeby: {
      host: 'localhost',
      port: 8565,
      network_id: 4,
      gas: 500000,
      gasPrice: 10e9, // 10 Gwei
    },
    kovan: {
      host: 'localhost',
      port: 8555,
      network_id: 42,
      gas: 2000000,
      gasPrice: 10e9, // 10 Gwei
    },
    mainnet: {
      host: 'localhost',
      port: 8546,
      network_id: '1',
      gas: 1000000,
      gasPrice: 10e9, // 10 Gwei
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
