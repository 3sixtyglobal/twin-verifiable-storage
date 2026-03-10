// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, Urn } from "@twin.org/core";
import {
	cleanupTestEnv,
	getTestDeploymentConfig,
	setupTestEnv,
	TEST_ADDRESS,
	TEST_ADDRESS_2,
	TEST_CLIENT_OPTIONS,
	TEST_EXPLORER_URL,
	TEST_MNEMONIC_NAME,
	TEST_NETWORK,
	TEST_USER_IDENTITY_ID,
	TEST_USER_IDENTITY_ID_2
} from "./setupTestEnv.js";
import { IotaVerifiableStorageConnector } from "../src/iotaVerifiableStorageConnector.js";
import type { IVerifiableStorageIotaReceipt2026 } from "../src/models/IVerifiableStorageIotaReceipt2026.js";

let connector: IotaVerifiableStorageConnector;

describe("IotaVerifiableStorageConnector", () => {
	beforeAll(async () => {
		await setupTestEnv();
		connector = new IotaVerifiableStorageConnector({
			config: {
				clientOptions: TEST_CLIENT_OPTIONS,
				vaultMnemonicId: TEST_MNEMONIC_NAME,
				network: TEST_NETWORK,
				gasBudget: 100_000_000,
				enableCostLogging: true
			},
			deploymentConfig: getTestDeploymentConfig()
		});
		// Start the connector (it will use test-deployed packages)
		await connector.start();
	});

	afterAll(async () => {
		await cleanupTestEnv();
	});

	test("Cannot store an item before bootstrap", async () => {
		const unstartedConnector = new IotaVerifiableStorageConnector({
			config: {
				clientOptions: TEST_CLIENT_OPTIONS,
				vaultMnemonicId: TEST_MNEMONIC_NAME,
				network: TEST_NETWORK,
				gasBudget: 100_000_000
			},
			deploymentConfig: getTestDeploymentConfig()
		});
		const data = Converter.utf8ToBytes("Test data");
		await expect(unstartedConnector.create(TEST_USER_IDENTITY_ID, data)).rejects.toThrow(
			"connectorNotStarted"
		);
	});

	test("Can store a verifiable item", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data);
		const itemId = result.id;
		const urn = Urn.fromValidString(result.id);
		expect(urn.namespaceIdentifier()).toEqual("verifiable");
		const specificParts = urn.namespaceSpecificParts();
		expect(specificParts[0]).toEqual("iota");
		expect(specificParts[1].length).toBeGreaterThan(0);
		expect(specificParts[2].length).toBeGreaterThan(0);

		console.debug(
			"Created",
			`${TEST_EXPLORER_URL}object/${specificParts[2]}?network=${TEST_NETWORK}`
		);

		const receipt = result.receipt as unknown as IVerifiableStorageIotaReceipt2026;

		expect(receipt["@context"]).toEqual("https://schema.twindev.org/verifiable-storage/");
		expect(receipt.type).toEqual("VerifiableStorageIotaReceipt2026");
		expect(receipt.epoch).greaterThan(0);
		expect(receipt.digest.length).greaterThan(0);
		expect(receipt.network).toEqual(TEST_NETWORK);

		const digest = receipt.digest;

		console.debug(
			"Digest",
			`${TEST_EXPLORER_URL}txblock/${receipt.digest}?network=${TEST_NETWORK}`
		);

		const getResult = await connector.get(itemId);
		expect(getResult.data).toEqual(Converter.utf8ToBytes("Hello, IOTA Verifiable Storage!"));
		const getReceipt = getResult.receipt as unknown as IVerifiableStorageIotaReceipt2026;
		expect(getReceipt.digest).toEqual(digest);
	});

	test("Can retrieve a verifiable item", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Retrieval!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data);
		const itemId = result.id;
		const createReceipt = result.receipt as unknown as IVerifiableStorageIotaReceipt2026;
		const digest = createReceipt.digest;

		const getResult = await connector.get(itemId);
		expect(getResult.data).toEqual(
			Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Retrieval!")
		);
		const receipt = getResult.receipt as unknown as IVerifiableStorageIotaReceipt2026;

		expect(receipt["@context"]).toEqual("https://schema.twindev.org/verifiable-storage/");
		expect(receipt.type).toEqual("VerifiableStorageIotaReceipt2026");
		expect(receipt.epoch).greaterThan(0);
		expect(receipt.digest.length).greaterThan(0);
		expect(receipt.digest).toEqual(digest);
		expect(receipt.network).toEqual(TEST_NETWORK);

		console.debug(
			"Digest",
			`${TEST_EXPLORER_URL}txblock/${receipt.digest}?network=${TEST_NETWORK}`
		);
	});

	test("Can update a verifiable item", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Update!");
		const createResult = await connector.create(TEST_USER_IDENTITY_ID, data);
		const itemId = createResult.id;

		const updateData = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage Updated!");
		const result = await connector.update(TEST_USER_IDENTITY_ID, itemId, updateData);

		const receipt = result as unknown as IVerifiableStorageIotaReceipt2026;

		expect(receipt["@context"]).toEqual("https://schema.twindev.org/verifiable-storage/");
		expect(receipt.type).toEqual("VerifiableStorageIotaReceipt2026");
		expect(receipt.epoch).greaterThan(0);
		expect(receipt.digest.length).greaterThan(0);
		expect(receipt.network).toEqual(TEST_NETWORK);

		const digest = receipt.digest;

		console.debug(
			"Digest",
			`${TEST_EXPLORER_URL}txblock/${receipt.digest}?network=${TEST_NETWORK}`
		);

		const getResult = await connector.get(itemId);
		expect(getResult.data).toEqual(
			Converter.utf8ToBytes("Hello, IOTA Verifiable Storage Updated!")
		);
		const getReceipt = getResult.receipt as unknown as IVerifiableStorageIotaReceipt2026;
		expect(getReceipt.digest).toEqual(digest);
	});

	test("Can retrieve an updated verifiable item", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Update Retrieval!");
		const createResult = await connector.create(TEST_USER_IDENTITY_ID, data);
		const itemId = createResult.id;

		const updateData = Converter.utf8ToBytes(
			"Hello, IOTA Verifiable Storage Updated for Retrieval!"
		);
		const updateResult = await connector.update(TEST_USER_IDENTITY_ID, itemId, updateData);
		const updateReceipt = updateResult as unknown as IVerifiableStorageIotaReceipt2026;
		const digest = updateReceipt.digest;

		const getResult = await connector.get(itemId);
		expect(getResult.data).toEqual(
			Converter.utf8ToBytes("Hello, IOTA Verifiable Storage Updated for Retrieval!")
		);
		const receipt = getResult.receipt as unknown as IVerifiableStorageIotaReceipt2026;

		expect(receipt["@context"]).toEqual("https://schema.twindev.org/verifiable-storage/");
		expect(receipt.type).toEqual("VerifiableStorageIotaReceipt2026");
		expect(receipt.epoch).greaterThan(0);
		expect(receipt.digest.length).greaterThan(0);
		expect(receipt.digest).toEqual(digest);
		expect(receipt.network).toEqual(TEST_NETWORK);

		console.debug(
			"Digest",
			`${TEST_EXPLORER_URL}txblock/${receipt.digest}?network=${TEST_NETWORK}`
		);
	});

	test("Can remove a verifiable item", async () => {
		const data = Converter.utf8ToBytes("Data to be deleted");
		const storeResult = await connector.create(TEST_USER_IDENTITY_ID, data);
		const getResult = await connector.get(storeResult.id);
		expect(getResult.data).toEqual(data);
		await connector.remove(TEST_USER_IDENTITY_ID, storeResult.id);
		await expect(connector.get(storeResult.id)).rejects.toThrow("objectNotFound");
	});

	test("Can store a verifiable item with additional allow list", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage with Allow List!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [TEST_ADDRESS_2]);
		const itemId = result.id;
		const urn = Urn.fromValidString(result.id);
		const specificParts = urn.namespaceSpecificParts();

		console.debug(
			"Created",
			`${TEST_EXPLORER_URL}object/${specificParts[2]}?network=${TEST_NETWORK}`
		);

		const receipt = result.receipt as unknown as IVerifiableStorageIotaReceipt2026;

		expect(receipt["@context"]).toEqual("https://schema.twindev.org/verifiable-storage/");
		expect(receipt.type).toEqual("VerifiableStorageIotaReceipt2026");
		expect(receipt.epoch).greaterThan(0);
		expect(receipt.digest.length).greaterThan(0);
		expect(receipt.network).toEqual(TEST_NETWORK);

		console.debug(
			"Digest",
			`${TEST_EXPLORER_URL}txblock/${receipt.digest}?network=${TEST_NETWORK}`
		);

		const getResult = await connector.get(itemId);
		expect(getResult.data).toEqual(
			Converter.utf8ToBytes("Hello, IOTA Verifiable Storage with Allow List!")
		);
		expect(getResult.allowList).toEqual([TEST_ADDRESS, TEST_ADDRESS_2]);
	});

	test("Can fail to update a verifiable item when user is not in allow list", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Access Control Test!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [
			"0x0000000000000000000000000000000000000000000000000000000000000000"
		]);
		const itemId = result.id;
		const urn = Urn.fromValidString(result.id);
		const specificParts = urn.namespaceSpecificParts();

		console.debug(
			"Created",
			`${TEST_EXPLORER_URL}object/${specificParts[2]}?network=${TEST_NETWORK}`
		);

		const data2 = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage Updated!");
		await expect(connector.update(TEST_USER_IDENTITY_ID_2, itemId, data2)).rejects.toThrow(
			"notInAllowList"
		);
	});

	test("Can update a verifiable item when user is in allow list", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Allow List Update!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [TEST_ADDRESS_2]);
		const itemId = result.id;
		const urn = Urn.fromValidString(result.id);
		const specificParts = urn.namespaceSpecificParts();

		console.debug(
			"Created",
			`${TEST_EXPLORER_URL}object/${specificParts[2]}?network=${TEST_NETWORK}`
		);

		const data2 = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage Updated by User 1!");
		const result2 = await connector.update(TEST_USER_IDENTITY_ID_2, itemId, data2);

		const receipt = result2 as unknown as IVerifiableStorageIotaReceipt2026;
		expect(receipt["@context"]).toEqual("https://schema.twindev.org/verifiable-storage/");
		expect(receipt.type).toEqual("VerifiableStorageIotaReceipt2026");
		expect(receipt.epoch).greaterThan(0);
		expect(receipt.digest.length).greaterThan(0);
		expect(receipt.network).toEqual(TEST_NETWORK);

		console.debug(
			"Digest",
			`${TEST_EXPLORER_URL}txblock/${receipt.digest}?network=${TEST_NETWORK}`
		);
	});

	test("Can update data without affecting the allowlist", async () => {
		const data = Converter.utf8ToBytes("Hello, data-only update test!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [TEST_ADDRESS_2]);
		const itemId = result.id;

		// Verify initial allowlist
		const getResult1 = await connector.get(itemId);
		expect(getResult1.allowList).toEqual([TEST_ADDRESS, TEST_ADDRESS_2]);

		// Update data only (no allowList parameter) — allowlist must be preserved
		const updateData = Converter.utf8ToBytes("Updated data, allowlist should be intact!");
		await connector.update(TEST_USER_IDENTITY_ID, itemId, updateData);

		const getResult2 = await connector.get(itemId);
		expect(getResult2.data).toEqual(updateData);
		expect(getResult2.allowList).toEqual([TEST_ADDRESS, TEST_ADDRESS_2]);

		// Verify the second user can still update (proves they're still in allowlist)
		const updateData2 = Converter.utf8ToBytes("User 2 can still update!");
		await connector.update(TEST_USER_IDENTITY_ID_2, itemId, updateData2);

		const getResult3 = await connector.get(itemId);
		expect(getResult3.data).toEqual(updateData2);
	});

	test("Can replace allowlist with new addresses when explicitly provided", async () => {
		const data = Converter.utf8ToBytes("Replace allowlist test!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [TEST_ADDRESS_2]);
		const itemId = result.id;

		// Verify initial allowlist contains creator and addr2
		const getResult1 = await connector.get(itemId);
		expect(getResult1.allowList).toEqual([TEST_ADDRESS, TEST_ADDRESS_2]);

		// Update with a new address — should replace, not merge
		const newAddress = "0x0000000000000000000000000000000000000000000000000000000000000001";
		await connector.update(TEST_USER_IDENTITY_ID, itemId, undefined, [newAddress]);

		const getResult2 = await connector.get(itemId);
		// Should contain creator + new address only, addr2 is removed
		expect(getResult2.allowList).toEqual([TEST_ADDRESS, newAddress]);
	});

	test("Can update a verifiable item when user is in allow list, then fail when they are removed", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Allow List Removal!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [TEST_ADDRESS_2]);
		const itemId = result.id;

		const data2 = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage Updated!");
		// Updating but passing an empty allow list, which will remove user 1
		await connector.update(TEST_USER_IDENTITY_ID_2, itemId, data2, []);

		// Now try to update again, which should fail
		await expect(connector.update(TEST_USER_IDENTITY_ID_2, itemId, data2)).rejects.toThrow(
			"notInAllowList"
		);
	});

	test("Can not remove a verifiable item unless you are the creator", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Creator Test!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data);
		const itemId = result.id;

		await expect(connector.remove(TEST_USER_IDENTITY_ID_2, itemId)).rejects.toThrow("notCreator");
	});

	test("Can fail to create verifiable item when the allow list exceeds the maximum size", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Max Size Test!");
		await expect(
			connector.create(TEST_USER_IDENTITY_ID, data, [TEST_ADDRESS_2], {
				maxAllowListSize: 1
			})
		).rejects.toThrow("allowListTooBig");
	});

	test("Can fail to update verifiable item when the allow list exceeds the maximum size", async () => {
		const data = Converter.utf8ToBytes("Hello, IOTA Verifiable Storage for Update Max Size Test!");
		const result = await connector.create(TEST_USER_IDENTITY_ID, data, [], {
			maxAllowListSize: 1
		});
		await expect(
			connector.update(TEST_USER_IDENTITY_ID, result.id, data, [TEST_ADDRESS_2])
		).rejects.toThrow("allowListTooBig");
	});
});
