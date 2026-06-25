// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Remove the verifiable storage item.
 */
export interface IVerifiableStorageRemoveRequest {
	/**
	 * The path parameters for the request.
	 */
	pathParams: {
		/**
		 * The id of the verifiable storage item to remove.
		 */
		id: string;
	};
}
