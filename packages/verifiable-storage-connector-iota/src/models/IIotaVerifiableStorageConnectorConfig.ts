// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IIotaConfig, ISmartContractDeployments } from "@twin.org/dlt-iota";

/**
 * Configuration interface for IOTA VerifiableStorageConnector.
 */
export interface IIotaVerifiableStorageConnectorConfig extends IIotaConfig {
	/**
	 * The name of the contract to use.
	 * @default "verifiable-storage"
	 */
	contractName?: string;

	/**
	 * The account address index to use when deriving addresses.
	 * @default 0
	 */
	accountAddressIndex?: number;

	/**
	 * The wallet address index to use when deriving addresses.
	 * @default 0
	 */
	walletAddressIndex?: number;

	/**
	 * The package controller address index to use when creating package.
	 * @default 0
	 */
	packageControllerAddressIndex?: number;

	/**
	 * Enable cost logging.
	 * @default false
	 */
	enableCostLogging?: boolean;

	/**
	 * Optional deployment configuration to use instead of the default compiled configuration.
	 * This allows tests and other scenarios to use different contract deployments.
	 * @default Uses compiled smart-contract-deployments.json
	 */
	deploymentConfig?: ISmartContractDeployments;

	/**
	 * Optional deployment package ID to use instead of the one from the deployment configuration.
	 */
	deploymentPkgId?: string;
}
