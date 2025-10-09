// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { VerifiableStorageRestClient } from "../src/verifiableStorageRestClient";

describe("VerifiableStorageRestClient", () => {
	test("Can create an instance", async () => {
		const client = new VerifiableStorageRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
