// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { VerifiableStorageContexts } from "@3sixty/verifiable-storage-models";
import type { IotaVerifiableStorageTypes } from "./iotaVerifiableStorageTypes.js";

/**
 * Receipt for the IOTA Verifiable Storage connector.
 */
export interface IVerifiableStorageIotaReceipt2026 {
	/**
	 * JSON-LD Context.
	 */
	"@context": typeof VerifiableStorageContexts.Context;

	/**
	 * JSON-LD Type.
	 */
	type: typeof IotaVerifiableStorageTypes.IotaReceipt2026;

	/**
	 * The epoch of the transaction.
	 * @json-ld type:schema:Integer
	 */
	epoch: number;

	/**
	 * The digest of the transaction.
	 * @json-ld type:schema:Text
	 */
	digest: string;

	/**
	 * The network of the transaction.
	 * @json-ld type:schema:Text
	 */
	network: string;

	/**
	 * The object id of the transaction.
	 * @json-ld type:schema:Text
	 */
	objectId: string;

	/**
	 * The smart contract id of the transaction.
	 * @json-ld type:schema:Text
	 */
	smartContractId: string;
}
