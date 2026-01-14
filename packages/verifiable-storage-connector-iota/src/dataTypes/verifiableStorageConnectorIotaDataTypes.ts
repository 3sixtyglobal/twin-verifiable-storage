// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory, type IJsonSchema } from "@twin.org/data-core";
import { VerifiableStorageContexts } from "@twin.org/verifiable-storage-models";
import { IotaVerifiableStorageTypes } from "../models/iotaVerifiableStorageTypes.js";
import VerifiableStorageIotaReceiptSchema from "../schemas/VerifiableStorageIotaReceipt.json" with { type: "json" };

/**
 * Handle all the data types for verifiable storage connector entity storage.
 */
export class VerifiableStorageConnectorIotaDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${VerifiableStorageContexts.Namespace}${IotaVerifiableStorageTypes.IotaReceipt}`,
			() => ({
				namespace: VerifiableStorageContexts.Namespace,
				type: IotaVerifiableStorageTypes.IotaReceipt,
				defaultValue: {},
				jsonSchema: async () => VerifiableStorageIotaReceiptSchema as IJsonSchema
			})
		);
	}
}
