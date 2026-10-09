// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, GuardError } from "@3sixty/core";
import type { IJsonLdNodeObject } from "@3sixty/data-json-ld";
import { VerifiableStorageContexts } from "@3sixty/verifiable-storage-models";
import { HttpMethod } from "@3sixty/web";
import { VerifiableStorageRestClient } from "../src/verifiableStorageRestClient.js";
import {
	jsonResponse,
	noContentResponse,
	setupFetchMock,
	teardownFetchMock
} from "./helpers/restClientTestHelpers.js";

// OpenAPI spec: ../../verifiable-storage-service/docs/open-api/spec.json
const ENDPOINT = "http://localhost:8080";
const PREFIX = "verifiable";

const ITEM_ID = "urn:verifiable:test001";

const TEST_RECEIPT: IJsonLdNodeObject = {
	"@context": VerifiableStorageContexts.JsonLdContext,
	"@type": "VerifiableReceipt",
	id: ITEM_ID,
	dateCreated: "2026-01-01T00:00:00Z"
};

const TEST_DATA = new Uint8Array([1, 2, 3, 4, 5]);
const TEST_DATA_BASE64 = Converter.bytesToBase64(TEST_DATA);

const TEST_CREATE_RESPONSE = {
	id: ITEM_ID,
	receipt: TEST_RECEIPT
};

const TEST_GET_RESPONSE = {
	receipt: TEST_RECEIPT,
	data: TEST_DATA_BASE64
};

const fetchMock = vi.fn();

describe("VerifiableStorageRestClient", () => {
	let client: VerifiableStorageRestClient;

	beforeEach(() => {
		setupFetchMock(fetchMock);
		client = new VerifiableStorageRestClient({ endpoint: ENDPOINT });
	});

	afterEach(() => {
		teardownFetchMock(fetchMock);
	});

	describe("create", () => {
		test("throws when data is not a Uint8Array", async () => {
			await expect(client.create(undefined as never)).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.uint8Array"
			});
		});

		test("sends POST to /{prefix}", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_CREATE_RESPONSE));

			await client.create(TEST_DATA);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends data as base64 in the request body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_CREATE_RESPONSE));

			await client.create(TEST_DATA);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.data).toBe(TEST_DATA_BASE64);
		});

		test("includes allowList in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_CREATE_RESPONSE));

			await client.create(TEST_DATA, ["did:example:alice", "did:example:bob"]);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.allowList).toEqual(["did:example:alice", "did:example:bob"]);
		});

		test("includes maxAllowListSize in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_CREATE_RESPONSE));

			await client.create(TEST_DATA, undefined, { maxAllowListSize: 50 });

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.maxAllowListSize).toBe(50);
		});

		test("returns the id and receipt from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_CREATE_RESPONSE));

			const result = await client.create(TEST_DATA);

			expect(result).toEqual(TEST_CREATE_RESPONSE);
		});
	});

	describe("update", () => {
		test("throws when id is empty", async () => {
			await expect(client.update("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when id is not a URN", async () => {
			await expect(client.update("not-a-urn")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.urn"
			});
		});

		test("sends PUT to /{prefix}/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_RECEIPT));

			await client.update(ITEM_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${ITEM_ID}`);
			expect(options.method).toBe(HttpMethod.PUT);
		});

		test("sends data as base64 in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_RECEIPT));

			await client.update(ITEM_ID, TEST_DATA);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.data).toBe(TEST_DATA_BASE64);
		});

		test("sends undefined data when not provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_RECEIPT));

			await client.update(ITEM_ID);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.data).toBeUndefined();
		});

		test("includes allowList in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_RECEIPT));

			await client.update(ITEM_ID, undefined, ["did:example:alice"]);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.allowList).toEqual(["did:example:alice"]);
		});

		test("returns the receipt from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_RECEIPT));

			const result = await client.update(ITEM_ID);

			expect(result).toEqual(TEST_RECEIPT);
		});
	});

	describe("get", () => {
		test("throws when id is empty", async () => {
			await expect(client.get("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_GET_RESPONSE));

			await client.get(ITEM_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${ITEM_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns decoded data and receipt from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_GET_RESPONSE));

			const result = await client.get(ITEM_ID);

			expect(result.data).toEqual(TEST_DATA);
			expect(result.receipt).toEqual(TEST_RECEIPT);
		});

		test("returns undefined data when not present in the response", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ receipt: TEST_RECEIPT }));

			const result = await client.get(ITEM_ID);

			expect(result.data).toBeUndefined();
			expect(result.receipt).toEqual(TEST_RECEIPT);
		});

		test("does not throw when includeData option is provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_GET_RESPONSE));

			await expect(client.get(ITEM_ID, { includeData: false })).resolves.toBeDefined();
		});
	});

	describe("remove", () => {
		test("throws when id is empty", async () => {
			await expect(client.remove("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when id is not a URN", async () => {
			await expect(client.remove("not-a-urn")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.urn"
			});
		});

		test("sends DELETE to /{prefix}/:id", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.remove(ITEM_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${ITEM_ID}`);
			expect(options.method).toBe(HttpMethod.DELETE);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await expect(client.remove(ITEM_ID)).resolves.toBeUndefined();
		});
	});
});
