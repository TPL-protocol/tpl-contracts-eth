module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gasPrice: 10 ** 9,
      gas: 6000000
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
}
