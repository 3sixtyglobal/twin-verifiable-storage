# Interface: IIotaVerifiableStorageConnectorConstructorOptions

Options for the IotaVerifiableStorageConnector.

## Properties

### config {#config}

> **config**: [`IIotaVerifiableStorageConnectorConfig`](IIotaVerifiableStorageConnectorConfig.md)

The configuration to use for the connector.

***

### vaultConnectorType? {#vaultconnectortype}

> `optional` **vaultConnectorType**: `string`

The vault connector type to use.

***

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType**: `string`

The logging component type.

***

### deploymentConfig? {#deploymentconfig}

> `optional` **deploymentConfig**: `ISmartContractDeployments`

Optional deployment configuration to use instead of the default compiled configuration.
This allows tests and other scenarios to use different contract deployments.
