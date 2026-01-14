// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of verifiable storage data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const VerifiableStorageContexts = {
	/**
	 * The namespace.
	 */
	Namespace: "https://schema.twindev.org/verifiable-storage/"
} as const;

/**
 * The contexts of verifiable storage data.
 */
export type VerifiableStorageContexts =
	(typeof VerifiableStorageContexts)[keyof typeof VerifiableStorageContexts];
