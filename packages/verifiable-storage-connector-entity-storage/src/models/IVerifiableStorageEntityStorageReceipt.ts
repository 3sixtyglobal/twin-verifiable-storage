// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { VerifiableStorageContexts } from "@3sixty/verifiable-storage-models";
import type { EntityStorageVerifiableStorageTypes } from "./entityStorageVerifiableStorageTypes.js";

/**
 * Receipt for the entity storage Verifiable Storage connector.
 */
export interface IVerifiableStorageEntityStorageReceipt {
	/**
	 * JSON-LD Context.
	 */
	"@context": typeof VerifiableStorageContexts.Context;

	/**
	 * JSON-LD Type.
	 */
	type: typeof EntityStorageVerifiableStorageTypes.EntityStorageReceipt;

	/**
	 * The entity storage Id.
	 * @json-ld type:schema:identifier
	 */
	entityStorageId: string;
}
