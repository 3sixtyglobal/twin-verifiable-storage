// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntityStorageVerifiableStorageConnector } from "@3sixty/verifiable-storage-connector-entity-storage";
import { VerifiableStorageConnectorFactory } from "@3sixty/verifiable-storage-models";
import { VerifiableStorageService } from "../src/verifiableStorageService.js";

describe("VerifiableStorageService", () => {
	test("Can create an instance", async () => {
		VerifiableStorageConnectorFactory.register(
			EntityStorageVerifiableStorageConnector.NAMESPACE,
			() => new EntityStorageVerifiableStorageConnector()
		);
		const service = new VerifiableStorageService();
		expect(service).toBeDefined();
	});
});
