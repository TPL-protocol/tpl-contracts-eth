module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
    ropsten: {
      host: 'localhost',
      port: 8565,
      network_id: 3,
      gasPrice: 30 ** 9,
      gas: 6000000,
      from: '0x09902a56d04a9446601a0d451e07459dc5af0820'
    }
  }
};
