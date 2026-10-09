// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of verifiable storage data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const VerifiableStorageContexts = {
	/**
	 * The canonical RDF namespace URI for Verifiable Storage.
	 */
	Namespace: "https://schema.3sixty.global/verifiable-storage/",

	/**
	 * The value to use in context for Verifiable Storage.
	 */
	Context: "https://schema.3sixty.global/verifiable-storage/",

	/**
	 * The JSON-LD Context URL for Verifiable Storage.
	 */
	JsonLdContext: "https://schema.3sixty.global/verifiable-storage/types.jsonld"
} as const;

/**
 * The contexts of verifiable storage data.
 */
export type VerifiableStorageContexts =
	(typeof VerifiableStorageContexts)[keyof typeof VerifiableStorageContexts];
