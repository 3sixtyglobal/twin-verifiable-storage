// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import { VerifiableStorageContexts } from "@twin.org/verifiable-storage-models";
import * as CompiledValidators from "../compiled/validators.js";
import { IotaVerifiableStorageTypes } from "../models/iotaVerifiableStorageTypes.js";
import VerifiableStorageIotaReceipt2026Schema from "../schemas/VerifiableStorageIotaReceipt2026.json" with { type: "json" };

/**
 * Handles all the data types for the IOTA verifiable storage connector.
 */
export class VerifiableStorageConnectorIotaDataTypes {
	/**
	 * Registers all data types for the IOTA verifiable storage connector.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${VerifiableStorageContexts.Namespace}${IotaVerifiableStorageTypes.IotaReceipt2026}`,
			() => ({
				namespace: VerifiableStorageContexts.Namespace,
				type: IotaVerifiableStorageTypes.IotaReceipt2026,
				defaultValue: {},
				jsonSchema: async () => VerifiableStorageIotaReceipt2026Schema,
				compiledValidator: async () => CompiledValidators.CompiledVerifiableStorageIotaReceipt2026
			})
		);
	}
}
