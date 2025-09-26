// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ISmartContractDeployments } from "@twin.org/dlt-iota";
import type { IIotaVerifiableStorageConnectorConfig } from "./IIotaVerifiableStorageConnectorConfig";

/**
 * Options for the IotaVerifiableStorageConnector.
 */
export interface IIotaVerifiableStorageConnectorConstructorOptions {
	/**
	 * The configuration to use for the connector.
	 */
	config: IIotaVerifiableStorageConnectorConfig;

	/**
	 * The vault connector type to use.
	 * @default "vault"
	 */
	vaultConnectorType?: string;

	/**
	 * The logging component type.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * Optional deployment configuration to use instead of the default compiled configuration.
	 * This allows tests and other scenarios to use different contract deployments.
	 * @default Uses compiled smart-contract-deployments.json
	 */
	deploymentConfig?: ISmartContractDeployments;
}
