// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@3sixty/data-json-ld";

/**
 * Response to updating the verifiable storage item.
 */
export interface IVerifiableStorageUpdateResponse {
	/**
	 * The receipt for the updated verifiable storage item.
	 */
	body: IJsonLdNodeObject;
}
