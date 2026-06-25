# Interface: IIotaVerifiableStorageConnectorConfig

Configuration interface for IOTA VerifiableStorageConnector.

## Extends

- `IIotaConfig`

## Properties

### contractName? {#contractname}

> `optional` **contractName?**: `string`

The name of the contract to use.

#### Default

```ts
"verifiable-storage"
```

***

### accountAddressIndex? {#accountaddressindex}

> `optional` **accountAddressIndex?**: `number`

The account address index to use when deriving addresses.

#### Default

```ts
0
```

***

### walletAddressIndex? {#walletaddressindex}

> `optional` **walletAddressIndex?**: `number`

The wallet address index to use when deriving addresses.

#### Default

```ts
0
```

***

### packageControllerAddressIndex? {#packagecontrolleraddressindex}

> `optional` **packageControllerAddressIndex?**: `number`

The package controller address index to use when creating package.

#### Default

```ts
0
```

***

### enableCostLogging? {#enablecostlogging}

> `optional` **enableCostLogging?**: `boolean`

Enable cost logging.

#### Default

```ts
false
```

#### Overrides

`IIotaConfig.enableCostLogging`

***

### deploymentConfig? {#deploymentconfig}

> `optional` **deploymentConfig?**: `ISmartContractDeployments`

Optional deployment configuration to use instead of the default compiled configuration.
This allows tests and other scenarios to use different contract deployments.

#### Default

```ts
Uses compiled smart-contract-deployments.json
```

***

### deploymentPkgId? {#deploymentpkgid}

> `optional` **deploymentPkgId?**: `string`

Optional deployment package ID to use instead of the one from the deployment configuration.
