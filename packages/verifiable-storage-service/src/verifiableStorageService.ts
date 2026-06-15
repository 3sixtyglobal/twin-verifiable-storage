// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Guards, Urn } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { nameof } from "@twin.org/nameof";
import {
	VerifiableStorageConnectorFactory,
	type IVerifiableStorageComponent,
	type IVerifiableStorageConnector
} from "@twin.org/verifiable-storage-models";
import type { IVerifiableStorageServiceConstructorOptions } from "./models/IVerifiableStorageServiceConstructorOptions.js";

/**
 * Service for performing Verifiable Storage operations to a connector.
 */
export class VerifiableStorageService implements IVerifiableStorageComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<VerifiableStorageService>();

	/**
	 * The namespace supported by the verifiableStorage service.
	 * @internal
	 */
	private static readonly _NAMESPACE: string = "verifiable";

	/**
	 * The default namespace for the connector to use.
	 * @internal
	 */
	private readonly _defaultNamespace: string;

	/**
	 * Create a new instance of VerifiableStorageService.
	 * @param options The options for the service.
	 */
	constructor(options?: IVerifiableStorageServiceConstructorOptions) {
		const names = VerifiableStorageConnectorFactory.names();
		if (names.length === 0) {
			throw new GeneralError(VerifiableStorageService.CLASS_NAME, "noConnectors");
		}

		this._defaultNamespace = options?.config?.defaultNamespace ?? names[0];
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return VerifiableStorageService.CLASS_NAME;
	}

	/**
	 * Create a verifiable storage item.
	 * @param data The data for the verifiable storage item.
	 * @param allowList The list of identities that are allowed to modify the item.
	 * @param options Additional options for creating the item.
	 * @param options.maxAllowListSize The maximum size of the allow list.
	 * @param namespace The namespace to use for the connector to use.
	 * @param controller The identity of the controller to access the vault keys.
	 * @returns The id of the created verifiable storage item.
	 */
	public async create(
		data: Uint8Array,
		allowList?: string[],
		options?: {
			maxAllowListSize?: number;
		},
		namespace?: string,
		controller?: string
	): Promise<{
		id: string;
		receipt: IJsonLdNodeObject;
	}> {
		Guards.uint8Array(VerifiableStorageService.CLASS_NAME, nameof(data), data);
		Guards.stringValue(VerifiableStorageService.CLASS_NAME, nameof(controller), controller);

		try {
			const connectorNamespace = namespace ?? this._defaultNamespace;

			const verifiableStorageConnector =
				VerifiableStorageConnectorFactory.get<IVerifiableStorageConnector>(connectorNamespace);

			const verifiableStorageResult = await verifiableStorageConnector.create(
				controller,
				data,
				allowList,
				options
			);

			return verifiableStorageResult;
		} catch (error) {
			throw new GeneralError(VerifiableStorageService.CLASS_NAME, "createFailed", undefined, error);
		}
	}

	/**
	 * Update an item in verifiable storage.
	 * @param id The id of the item to update.
	 * @param data The data to store, optional if updating the allow list.
	 * @param allowList Updated list of identities that are allowed to modify the item.
	 * @param controller The identity of the controller to access the vault keys.
	 * @returns The updated receipt.
	 */
	public async update(
		id: string,
		data?: Uint8Array,
		allowList?: string[],
		controller?: string
	): Promise<IJsonLdNodeObject> {
		Urn.guard(VerifiableStorageService.CLASS_NAME, nameof(id), id);
		Guards.stringValue(VerifiableStorageService.CLASS_NAME, nameof(controller), controller);

		try {
			const verifiableStorageConnector = this.getConnector(id);
			const verifiableStorageResult = await verifiableStorageConnector.update(
				controller,
				id,
				data,
				allowList
			);

			return verifiableStorageResult;
		} catch (error) {
			throw new GeneralError(VerifiableStorageService.CLASS_NAME, "updateFailed", undefined, error);
		}
	}

	/**
	 * Get a verifiable storage item.
	 * @param id The id of the verifiable storage item to get.
	 * @param options Additional options for getting the verifiable storage item.
	 * @param options.includeData Should the data be included in the response, defaults to true.
	 * @param options.includeAllowList Should the allow list be included in the response, defaults to true.
	 * @returns The data and receipt for the verifiable storage item.
	 */
	public async get(
		id: string,
		options?: { includeData?: boolean; includeAllowList?: boolean }
	): Promise<{
		data?: Uint8Array;
		receipt: IJsonLdNodeObject;
	}> {
		Urn.guard(VerifiableStorageService.CLASS_NAME, nameof(id), id);

		try {
			const verifiableStorageConnector = this.getConnector(id);
			const result = await verifiableStorageConnector.get(id, options);
			return result;
		} catch (error) {
			throw new GeneralError(VerifiableStorageService.CLASS_NAME, "getFailed", undefined, error);
		}
	}

	/**
	 * Remove a verifiable storage item.
	 * @param id The id of the verifiable storage item to remove.
	 * @param controller The identity of the controller to access the vault keys.
	 * @returns A promise that resolves when the item has been removed.
	 */
	public async remove(id: string, controller?: string): Promise<void> {
		Urn.guard(VerifiableStorageService.CLASS_NAME, nameof(id), id);
		Guards.stringValue(VerifiableStorageService.CLASS_NAME, nameof(controller), controller);

		try {
			const verifiableStorageConnector = this.getConnector(id);
			await verifiableStorageConnector.remove(controller, id);
		} catch (error) {
			throw new GeneralError(VerifiableStorageService.CLASS_NAME, "removeFailed", undefined, error);
		}
	}

	/**
	 * Get the connector from the uri.
	 * @param id The id of the item in urn format.
	 * @returns The connector.
	 * @throws GeneralError If the namespace does not match.
	 * @internal
	 */
	private getConnector(id: string): IVerifiableStorageConnector {
		const idUri = Urn.fromValidString(id);

		if (idUri.namespaceIdentifier() !== VerifiableStorageService._NAMESPACE) {
			throw new GeneralError(VerifiableStorageService.CLASS_NAME, "namespaceMismatch", {
				namespace: VerifiableStorageService._NAMESPACE,
				id
			});
		}

		return VerifiableStorageConnectorFactory.get<IVerifiableStorageConnector>(
			idUri.namespaceMethod()
		);
	}
}
