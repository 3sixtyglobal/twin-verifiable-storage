// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import { VerifiableStorageContexts } from "@twin.org/verifiable-storage-models";
import * as CompiledValidators from "../compiled/validators.js";
import { EntityStorageVerifiableStorageTypes } from "../models/entityStorageVerifiableStorageTypes.js";
import VerifiableStorageEntityStorageReceiptSchema from "../schemas/VerifiableStorageEntityStorageReceipt.json" with { type: "json" };

/**
 * Handles all the data types for the entity storage verifiable storage connector.
 */
export class VerifiableStorageConnectorEntityStorageDataTypes {
	/**
	 * Registers all data types for the entity storage verifiable storage connector.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${VerifiableStorageContexts.Namespace}${EntityStorageVerifiableStorageTypes.EntityStorageReceipt}`,
			() => ({
				namespace: VerifiableStorageContexts.Namespace,
				type: EntityStorageVerifiableStorageTypes.EntityStorageReceipt,
				defaultValue: {},
				jsonSchema: async () => VerifiableStorageEntityStorageReceiptSchema,
				compiledValidator: async () =>
					CompiledValidators.CompiledVerifiableStorageEntityStorageReceipt
			})
		);
	}
}
