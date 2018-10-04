# Transaction Permission Layer for zOS

This is the ZeppelinOS version of tpl-contracts, forked from it's audit branch. This documentation refers only to the code's zOS aspect.

For info on TPL itself, please see: https://github.com/TPL-protocol/tpl-contracts/tree/audi://github.com/TPL-protocol/tpl-contracts/tree/audit 

### Deploying the standard library in zOS

This library was deployed as any other zOS standard library using:
```
npx zos init --lib tpl-contracts-zos
npx zos add BasicJurisdiction
npx push --network network_name
```

Currently deployed in the following networks:
- ropsten

For more iformation, please see: https://docs.zeppelinos.org/docs/developing.html

### Linking to the library via zOS

Link to the library just as any other zOS library:
```
zos link tpl-contracts-zos
```

For more iformation, please see: https://docs.zeppelinos.org/docs/using.html
