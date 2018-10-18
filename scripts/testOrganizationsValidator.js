var assert = require('assert')

const JurisdictionContractData = require('../build/contracts/BasicJurisdiction.json')
const OrganizationsValidatorContractData = require('../build/contracts/OrganizationsValidator.json')
const TPLTokenMockContractData = require('../build/contracts/TPLTokenMock.json')
const applicationConfig = require('../config.js')

const OrganizationsValidatorAttributeID = applicationConfig.OrganizationsValidatorAttributeID
const OrganizationsValidatorDescription = applicationConfig.OrganizationsValidatorDescription

const TPLTokenMockTotalSupply = applicationConfig.TPLTokenMockTotalSupply
const TPLTokenMockAttributeRestricted = applicationConfig[
  'TPLTokenMockAttributeRestricted'
]
const TPLTokenMockAttributeMinimumRequiredStake = applicationConfig[
  'TPLTokenMockAttributeMinimumRequiredStake'
]
const TPLTokenMockAttributeJurisdictionFee = applicationConfig[
  'TPLTokenMockAttributeJurisdictionFee'
]
const TPLTokenMockAttributeDescription = applicationConfig[
  'TPLTokenMockAttributeDescription'
]

const mockOrganizationName = 'Mock Organization'

module.exports = {test: async function (provider, testingContext) {
  var web3 = provider
  let passed = 0
  let failed = 0
  console.log('running tests...')
  // get available addresses and assign them to various roles
  const addresses = await Promise.resolve(web3.eth.getAccounts())
  if (addresses.length < 4) {
    console.log('cannot find enough addresses to run tests...')
    return false
  }

  const address = addresses[0]
  const organizationAddress = addresses[1]
  const attributedAddress = addresses[2]
  const inattributedAddress = addresses[3]
  const nullAddress = '0x0000000000000000000000000000000000000000'

  const Jurisdiction = new web3.eth.Contract(JurisdictionContractData.abi)
  const OrganizationsValidator = new web3.eth.Contract(OrganizationsValidatorContractData.abi)
  const TPLTokenMock = new web3.eth.Contract(TPLTokenMockContractData.abi)

  const NiceJurisdictionBytecode = '0x608060405234801561001057600080fd5b50610' +
    '144806100206000396000f3006080604052600436106100565763ffffffff7c010000000' +
    '00000000000000000000000000000000000000000000000006000350416634b5f297a811' +
    '461005b57806350135c3a146100a0578063f9292ffb146100d6575b600080fd5b3480156' +
    '1006757600080fd5b5061008c73ffffffffffffffffffffffffffffffffffffffff60043' +
    '516602435610107565b604080519115158252519081900360200190f35b3480156100ac5' +
    '7600080fd5b506100d473ffffffffffffffffffffffffffffffffffffffff60043516602' +
    '43560443561010f565b005b3480156100e257600080fd5b506100d473fffffffffffffff' +
    'fffffffffffffffffffffffff60043516602435610114565b600192915050565b5050505' +
    '65b50505600a165627a7a723058205c8e3ea0efcf4a33839628ab99c4130bcb14c4c9bcf' +
    '7ffe6598e9e83ccb65eac0029'

  const NaughtyJurisdictionBytecode = '0x608060405234801561001057600080fd5b50' +
    '60fb8061001f6000396000f30060806040526004361060485763ffffffff7c0100000000' +
    '0000000000000000000000000000000000000000000000006000350416634b5f297a8114' +
    '604d57806350135c3a14608f575b600080fd5b348015605857600080fd5b50607b73ffff' +
    'ffffffffffffffffffffffffffffffffffff6004351660243560c2565b60408051911515' +
    '8252519081900360200190f35b348015609a57600080fd5b5060c073ffffffffffffffff' +
    'ffffffffffffffffffffffff6004351660243560443560ca565b005b600092915050565b' +
    '5050505600a165627a7a723058208d9ec5e4fb7457dd8e002af2e6990bc6bebd16775a2f' +
    'e18d55edef7ace7bfbae0029'



// *************************** deploy contracts *************************** //
  let deployGas;

  const latestBlock = await web3.eth.getBlock('latest')
  const gasLimit = latestBlock.gasLimit

  const JurisdictionContractInstance = await Jurisdiction.deploy(
    {
      data: JurisdictionContractData.bytecode
    }
  ).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  }).catch(error => {
    console.error(error)
    process.exit(1)
  })

  const jurisdictionAddress = JurisdictionContractInstance.options.address 

  const OrganizationsValidatorContractInstance = await OrganizationsValidator.deploy({
    data: OrganizationsValidatorContractData.bytecode
  }).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  })

  const OrganizationsValidatorAddress = OrganizationsValidatorContractInstance.options.address

  const TPLTokenMockContractInstance = await TPLTokenMock.deploy({
    data: TPLTokenMockContractData.bytecode
  }).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  })

  const tokenAddress = TPLTokenMockContractInstance.options.address

  const NiceJurisdictionContractInstance = await Jurisdiction.deploy(
    {
      data: NiceJurisdictionBytecode
    }
  ).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  }).catch(error => {
    console.error(error)
    process.exit(1)
  })

  const NiceOrganizationsValidatorContractInstance = await OrganizationsValidator.deploy({
    data: OrganizationsValidatorContractData.bytecode
  }).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  })

  const NaughtyJurisdictionContractInstance = await Jurisdiction.deploy(
    {
      data: NaughtyJurisdictionBytecode
    }
  ).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  }).catch(error => {
    console.error(error)
    process.exit(1)
  })

  const NaughtyOrganizationsValidatorContractInstance = await OrganizationsValidator.deploy({
    data: OrganizationsValidatorContractData.bytecode
  }).send({
    from: address,
    gas: gasLimit - 1,
    gasPrice: 10 ** 1
  })

  console.log(' ✓ contracts deploy successfully')
  passed++

  await JurisdictionContractInstance.methods.initialize(address).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      " ✓ jurisdiction contract can be initialized"
    )
    passed++
  })

  await JurisdictionContractInstance.methods.pause(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  })
  console.log(` ✓ Jurisdiction contract can be paused`)
  passed++

  await JurisdictionContractInstance.methods.unpause(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  })
  console.log(` ✓ Jurisdiction contract can be unpaused`)
  passed++

  await OrganizationsValidatorContractInstance.methods.initialize(
    JurisdictionContractInstance.options.address,
    OrganizationsValidatorAttributeID,
    address
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      " ✓ Orgainzations Validator contract can be initialized"
    )
    passed++
  })

  await NiceOrganizationsValidatorContractInstance.methods.initialize(
    NiceJurisdictionContractInstance.options.address,
    OrganizationsValidatorAttributeID,
    address
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      " ✓ Nice Organizations Validator contract can be initialized"
    )
    passed++
  })

  await NaughtyOrganizationsValidatorContractInstance.methods.initialize(
    NaughtyJurisdictionContractInstance.options.address,
    OrganizationsValidatorAttributeID,
    address
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      " ✓ Naughty Organizations Validator contract can be initialized"
    )
    passed++
  })

  await TPLTokenMockContractInstance.methods.initialize(
    TPLTokenMockTotalSupply,
    JurisdictionContractInstance.options.address,
    OrganizationsValidatorAttributeID
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      " ✓ token contract can be initialized"
    )
    passed++
  })

  await JurisdictionContractInstance.methods.owner().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(ownerAddress => {
    assert.strictEqual(ownerAddress, address)
    console.log(' ✓ jurisdiction owner is set to the correct address')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.owner().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(ownerAddress => {
    assert.strictEqual(ownerAddress, address)
    console.log(' ✓ Organizations Validator owner is set to the correct address')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getValidAttributeTypeID().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(ID => {
    assert.strictEqual(ID, OrganizationsValidatorAttributeID.toString())
    console.log(' ✓ Organizations Validator has the correct attribute ID')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizations().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organizations => {
    assert.strictEqual(organizations.length, 0)
    console.log(' ✓ Organizations Validator organizations are initially empty')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizationInformation(
    organizationAddress
  ).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organization => {
    assert.strictEqual(organization.exists, false)
    assert.strictEqual(organization.maximumAccounts, '0')
    assert.strictEqual(organization.name, '')
    assert.strictEqual(organization.issuedAccounts.length, 0)
    console.log(' ✓ Organizations Validator gives empty data for organization query')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getJurisdiction().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(foundJurisdictionAddress => {
    assert.strictEqual(foundJurisdictionAddress, jurisdictionAddress)
    console.log(
      ' ✓ Organizations Validator points to the correct jurisdiction address'
    )
    passed++
  })

  await TPLTokenMockContractInstance.methods.getRegistry().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(registryAddress => {
    assert.strictEqual(registryAddress, jurisdictionAddress)
    console.log(
      ' ✓ registry utilized by mock token is set to the jurisdiction address'
    )
    passed++
  })
  
  await TPLTokenMockContractInstance.methods.balanceOf(address).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(balance => {
    assert.strictEqual(balance, TPLTokenMockTotalSupply.toString())
    console.log(' ✓ mock token has the correct balance')
    passed++
  })

  await TPLTokenMockContractInstance.methods.transfer(inattributedAddress, 1).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      " ✓ tokens can't be transferred before valid attributes are assigned"
    )
    passed++
  })

  console.log(' ✓ Organizations Validator can be properly set up by the jurisdiction')

  await JurisdictionContractInstance.methods.addAttributeType(
    OrganizationsValidatorAttributeID,
    TPLTokenMockAttributeDescription
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  })
  console.log(` ✓ Validator's attribute type can be added to jurisdiction`)
  passed++

  await JurisdictionContractInstance.methods.addValidator(
    OrganizationsValidatorAddress,
    OrganizationsValidatorDescription
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  })
  console.log(` ✓ Organizations Validator can be added to jurisdiction`)
  passed++

  await JurisdictionContractInstance.methods.addValidatorApproval(
    OrganizationsValidatorAddress,
    OrganizationsValidatorAttributeID
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  })
  console.log(` ✓ Organizations Validator can be approved to issue target attribute`)
  passed++

  await OrganizationsValidatorContractInstance.methods.addOrganization(
    organizationAddress,
    20, // maximumAccounts
    mockOrganizationName
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    console.log(` ✓ Organizations Validator can add an organization`)
    passed++

    const logs = receipt.events.OrganizationAdded.returnValues
    assert.strictEqual(logs.organization, organizationAddress)
    assert.strictEqual(logs.name, mockOrganizationName)
    console.log(' ✓ OrganizationAdded event is logged correctly')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.countOrganizations().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organizations => {
    assert.strictEqual(organizations, '1')
    console.log(' ✓ the organizations can be counted')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganization(0).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organization => {
    assert.strictEqual(organization, organizationAddress)
    console.log(' ✓ the organization address can be found via index')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizations().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organizations => {
    assert.strictEqual(organizations.length, 1)
    assert.strictEqual(organizations[0], organizationAddress)
    console.log(' ✓ the organization address can be found via dynamic array')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizationInformation(
    organizationAddress
  ).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organization => {
    assert.strictEqual(organization.exists, true)
    assert.strictEqual(organization.maximumAccounts, '20')
    assert.strictEqual(organization.name, mockOrganizationName)
    assert.strictEqual(organization.issuedAccounts.length, 0)
    console.log(
      ' ✓ Organizations Validator gives correct data for organization query'
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.addOrganization(
    nullAddress,
    100,
    mockOrganizationName
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ Organizations Validator cannot add an organization with an empty address`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.addOrganization(
    organizationAddress,
    100,
    mockOrganizationName
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(` ✓ Organizations Validator cannot add a duplicate organization`)
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.addOrganization(
    address,
    100,
    mockOrganizationName
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    console.log(` ✓ Organizations Validator can add multiple organizations`)
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.addOrganization(
    inattributedAddress,
    100,
    mockOrganizationName
  ).send({
    from: inattributedAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(` ✓ non-owner cannot add an organization`)
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.setMaximumIssuableAttributes(
    organizationAddress,
    2
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    console.log(
      ` ✓ Organizations Validator can change maximum address an organization can issue`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizations().call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organizations => {
    assert.strictEqual(organizations.length, 2)
    assert.strictEqual(organizations[0], organizationAddress)
    assert.strictEqual(organizations[1], address)
    console.log(' ✓ the organization addresses can still be found')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizationInformation(
    organizationAddress
  ).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organization => {
    assert.strictEqual(organization.exists, true)
    assert.strictEqual(organization.maximumAccounts, '2')
    assert.strictEqual(organization.name, mockOrganizationName)
    assert.strictEqual(organization.issuedAccounts.length, 0)
    console.log(
      ' ✓ Organizations Validator gives updated data for organization query'
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.setMaximumIssuableAttributes(
    inattributedAddress,
    2
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ Organizations Validator cannot change maximum address for unknown organization`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.setMaximumIssuableAttributes(
    organizationAddress,
    100
  ).send({
    from: inattributedAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ non-owner cannot change maximum address an organization can issue`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.pauseIssuance(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  })
  console.log(` ✓ Organizations Validator attribute issuance can be paused`)
  passed++

  await OrganizationsValidatorContractInstance.methods.issuanceIsPaused(
  ).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(isPaused => {
    assert.ok(isPaused)
    console.log(` ✓ checks for paused issuance return true when paused`)
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot issue attributes when issuance is paused`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.unpauseIssuance(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  })
  console.log(` ✓ Organizations Validator attribute issuance can be unpaused`)
  passed++

  await OrganizationsValidatorContractInstance.methods.unpauseIssuance(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).catch(error => {
    console.log(
      ` ✓ attribute issuance cannot be unpaused when already unpaused`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.pause(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  })
  console.log(` ✓ Organizations Validator contract can be paused`)
  passed++

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot issue attributes when contract is paused`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.unpause(
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  })
  console.log(` ✓ Organizations Validator contract can be unpaused`)
  passed++

  await JurisdictionContractInstance.methods.removeValidator(
    OrganizationsValidatorAddress
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  })
  console.log(` ✓ Organizations Validator can be removed from jurisdiction`)
  passed++

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ jurisdiction will reject issued attributes when validator is removed`
    )
    passed++
  })

  await JurisdictionContractInstance.methods.addValidator(
    OrganizationsValidatorAddress,
    OrganizationsValidatorDescription
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  })
  console.log(` ✓ Organizations Validator can be added back to jurisdiction`)
  passed++

  await JurisdictionContractInstance.methods.addValidatorApproval(
    OrganizationsValidatorAddress,
    OrganizationsValidatorAttributeID
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  })
  console.log(
    ` ✓ Organizations Validator must be reapproved to issue target attribute`
  )
  passed++

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    assert.ok(receipt.status)
    console.log(
      ` ✓ organization can issue attributes to an address`
    )
    passed++

    const logs = receipt.events.AttributeIssued.returnValues
    assert.strictEqual(logs.organization, organizationAddress)
    assert.strictEqual(logs.attributee, attributedAddress)
    console.log(' ✓ AttributeIssued event is logged correctly')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ duplicate attribute issuances on the same address are rejected`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.setMaximumIssuableAttributes(
    organizationAddress,
    0
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ Organizations Validator cannot change max addresses to amount below current`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizationInformation(
    organizationAddress
  ).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organization => {
    assert.strictEqual(organization.exists, true)
    assert.strictEqual(organization.maximumAccounts, '2')
    assert.strictEqual(organization.name, mockOrganizationName)
    assert.strictEqual(organization.issuedAccounts.length, 1)
    assert.strictEqual(organization.issuedAccounts[0], attributedAddress)
    console.log(
      ' ✓ Organizations Validator gives updated data for organization query'
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    inattributedAddress
  ).send({
    from: inattributedAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ non-organization cannot issue attributes to an address`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    nullAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot issue attributes to an empty address`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot issue attributes to duplicate addresses`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    address
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    console.log(
      ` ✓ organization can issue attributes to multiple address`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.getOrganizationInformation(
    organizationAddress
  ).call({
    from: address,
    gas: 5000000,
    gasPrice: 10 ** 9
  }).then(organization => {
    assert.strictEqual(organization.exists, true)
    assert.strictEqual(organization.maximumAccounts, '2')
    assert.strictEqual(organization.name, mockOrganizationName)
    assert.strictEqual(organization.issuedAccounts.length, 2)
    assert.strictEqual(organization.issuedAccounts[0], attributedAddress)
    assert.strictEqual(organization.issuedAccounts[1], address)
    console.log(
      ' ✓ Organizations Validator gives updated data for organization query'
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.issueAttribute(
    inattributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot issue attributes beyond the allowed maximum`
    )
    passed++
  })  

  await OrganizationsValidatorContractInstance.methods.revokeAttribute(
    attributedAddress
  ).send({
    from: inattributedAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ non-organization cannot revoke attributes from an address`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.revokeAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    assert.ok(receipt.status)
    console.log(
      ` ✓ organization can revoke attributes from an address`
    )
    passed++

    const logs = receipt.events.AttributeRevoked.returnValues
    assert.strictEqual(logs.organization, organizationAddress)
    assert.strictEqual(logs.attributee, attributedAddress)
    console.log(' ✓ AttributeRevoked event is logged correctly')
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.revokeAttribute(
    nullAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot revoke attributes from zero address`
    )
    passed++
  })

  await OrganizationsValidatorContractInstance.methods.revokeAttribute(
    inattributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot revoke unissued attributes from an address`
    )
    passed++
  })

  // the "naughty" jurisdiction always returns false: attributes cannot be added
  await NaughtyOrganizationsValidatorContractInstance.methods.addOrganization(
    organizationAddress,
    20, // maximumAccounts
    mockOrganizationName
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    console.log(` ✓ Organizations Validator attached to naughty jurisdiction can add org`)
    passed++
  })

  await NaughtyOrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization can't 'issue' attributes to naughty jurisdiction`
    )
    passed++
  })

  // the "nice" jurisdiction always returns true: attributes cannot be revoked
  await NiceOrganizationsValidatorContractInstance.methods.addOrganization(
    organizationAddress,
    20, // maximumAccounts
    mockOrganizationName
  ).send({
    from: address,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    console.log(` ✓ Organizations Validator attached to nice jurisdiction can add org`)
    passed++
  })

  await NiceOrganizationsValidatorContractInstance.methods.issueAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).then(receipt => {
    assert.ok(receipt.status)
    console.log(
      ` ✓ organization can 'issue' attributes to nice jurisdiction`
    )
    passed++
  })

  await NiceOrganizationsValidatorContractInstance.methods.revokeAttribute(
    attributedAddress
  ).send({
    from: organizationAddress,
    gas: 5000000,
    gasPrice: '1000000000'
  }).catch(error => {
    console.log(
      ` ✓ organization cannot revoke attributes when jurisdiction doesn't also`
    )
    passed++
  })

  console.log(
    `completed ${passed + failed} tests with ${failed} ` +
    `failure${failed === 1 ? '' : 's'}.`
  )
  if (failed > 0) {
    process.exit(1)
  }

  process.exit(0)

}}
