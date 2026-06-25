// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Verifiable Storage Service.
 */
export interface IVerifiableStorageServiceConfig {
	/**
	 * The default connector namespace to use; falls back to the first registered connector if not provided.
	 */
	defaultNamespace?: string;
}
