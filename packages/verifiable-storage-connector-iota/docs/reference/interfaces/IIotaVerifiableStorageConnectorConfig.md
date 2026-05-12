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
