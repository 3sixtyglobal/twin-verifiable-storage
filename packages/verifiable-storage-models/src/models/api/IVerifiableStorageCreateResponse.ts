// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ICreatedResponse } from "@3sixty/api-models";
import type { IJsonLdNodeObject } from "@3sixty/data-json-ld";

/**
 * Response to storing the verifiable storage item.
 */
export interface IVerifiableStorageCreateResponse extends ICreatedResponse {
	/**
	 * The created verifiable storage item details.
	 */
	body: {
		/**
		 * The receipt associated to the verifiable storage item.
		 */
		receipt: IJsonLdNodeObject;

		/**
		 * The id of the verifiable storage item.
		 */
		id: string;
	};
}
