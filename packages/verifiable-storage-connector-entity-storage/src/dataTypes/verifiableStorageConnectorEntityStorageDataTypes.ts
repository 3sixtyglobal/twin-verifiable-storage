// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import { VerifiableStorageContexts } from "@twin.org/verifiable-storage-models";
import { EntityStorageVerifiableStorageTypes } from "../models/entityStorageVerifiableStorageTypes.js";
import VerifiableStorageEntityStorageReceiptSchema from "../schemas/VerifiableStorageEntityStorageReceipt.json" with { type: "json" };

/**
 * Handle all the data types for verifiable storage connector entity storage.
 */
export class VerifiableStorageConnectorEntityStorageDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${VerifiableStorageContexts.Namespace}${EntityStorageVerifiableStorageTypes.EntityStorageReceipt}`,
			() => ({
				namespace: VerifiableStorageContexts.Namespace,
				type: EntityStorageVerifiableStorageTypes.EntityStorageReceipt,
				defaultValue: {},
				jsonSchema: async () => VerifiableStorageEntityStorageReceiptSchema
			})
		);
	}
}
