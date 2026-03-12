# Interface: IIotaVerifiableStorageConnectorConfig

Configuration interface for IOTA VerifiableStorageConnector.

## Extends

- `IIotaConfig`

## Properties

### contractName? {#contractname}

> `optional` **contractName**: `string`

The name of the contract to use.

***

### walletAddressIndex? {#walletaddressindex}

> `optional` **walletAddressIndex**: `number`

The wallet address index to use when deriving addresses.

***

### packageControllerAddressIndex? {#packagecontrolleraddressindex}

> `optional` **packageControllerAddressIndex**: `number`

The package controller address index to use when creating package.

***

### enableCostLogging? {#enablecostlogging}

> `optional` **enableCostLogging**: `boolean`

Enable cost logging.

#### Overrides

`IIotaConfig.enableCostLogging`
