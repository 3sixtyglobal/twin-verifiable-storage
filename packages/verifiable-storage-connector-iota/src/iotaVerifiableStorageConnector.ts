// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	BaseError,
	Coerce,
	ComponentFactory,
	Converter,
	GeneralError,
	Guards,
	Is,
	StringHelper,
	UnauthorizedError,
	Urn
} from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import {
	type IContractData,
	type ISmartContractDeployments,
	type NetworkTypes,
	type IIotaClient,
	Iota
} from "@twin.org/dlt-iota";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { VaultConnectorFactory, type IVaultConnector } from "@twin.org/vault-models";
import {
	VerifiableStorageContexts,
	type IVerifiableStorageConnector
} from "@twin.org/verifiable-storage-models";
import compiledModulesJson from "./contracts/smartContractDeployments/smart-contract-deployments.json" with { type: "json" };
import { IotaVerifiableStorageUtils } from "./iotaVerifiableStorageUtils.js";
import type { IIotaVerifiableStorageConnectorConfig } from "./models/IIotaVerifiableStorageConnectorConfig.js";
import type { IIotaVerifiableStorageConnectorConstructorOptions } from "./models/IIotaVerifiableStorageConnectorConstructorOptions.js";
import { IotaVerifiableStorageTypes } from "./models/iotaVerifiableStorageTypes.js";
import type { IVerifiableStorageIotaReceipt2026 } from "./models/IVerifiableStorageIotaReceipt2026.js";

/**
 * Class for performing verifiable storage operations on IOTA.
 */
export class IotaVerifiableStorageConnector implements IVerifiableStorageConnector {
	/**
	 * The namespace supported by the storage connector.
	 */
	public static readonly NAMESPACE: string = "iota";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IotaVerifiableStorageConnector>();

	/**
	 * The default maximum size of the allow list.
	 * @internal
	 */
	private static readonly _DEFAULT_ALLOW_LIST_SIZE: number = 100;

	/**
	 * The vault connector.
	 * @internal
	 */
	private readonly _vaultConnector: IVaultConnector;

	/**
	 * The gas budget to use for the transaction.
	 * @internal
	 */
	private readonly _gasBudget: number;

	/**
	 * The configuration to use for IOTA operations.
	 * @internal
	 */
	private readonly _config: IIotaVerifiableStorageConnectorConfig;

	/**
	 * The IOTA client.
	 * @internal
	 */
	private readonly _client: IIotaClient;

	/**
	 * The name of the contract to use.
	 * @internal
	 */
	private readonly _contractName: string;

	/**
	 * The package ID of the deployed storage Move module.
	 * @internal
	 */
	private _deployedPackageId?: string;

	/**
	 * The smart contract deployment configuration.
	 * @internal
	 */
	private readonly _deploymentConfig: ISmartContractDeployments;

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of IotaVerifiableStorageConnector.
	 * @param options The options for the storage connector.
	 */
	constructor(options: IIotaVerifiableStorageConnectorConstructorOptions) {
		Guards.object<IIotaVerifiableStorageConnectorConstructorOptions>(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(options),
			options
		);
		Guards.object<IIotaVerifiableStorageConnectorConfig>(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(options.config.network),
			options.config.network
		);
		this._vaultConnector = VaultConnectorFactory.get(options?.vaultConnectorType ?? "vault");

		this._logging = ComponentFactory.getIfExists(options?.loggingComponentType ?? "logging");

		this._config = options.config;

		this._deploymentConfig = options?.config?.deploymentConfig ?? compiledModulesJson;

		this._contractName = this._config.contractName ?? "verifiable-storage";
		Guards.stringValue(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(this._contractName),
			this._contractName
		);

		this._gasBudget = this._config.gasBudget ?? 1_000_000_000;
		Guards.number(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(this._gasBudget),
			this._gasBudget
		);
		if (this._gasBudget <= 0) {
			throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "invalidGasBudget", {
				gasBudget: this._gasBudget
			});
		}

		Iota.populateConfig(this._config);
		this._client = Iota.createClient(this._config);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return IotaVerifiableStorageConnector.CLASS_NAME;
	}

	/**
	 * Bootstrap the Verifiable Storage contract.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns True if the bootstrapping process was successful.
	 */
	public async start(nodeLoggingComponentType?: string): Promise<void> {
		const nodeLogging = ComponentFactory.getIfExists<ILoggingComponent>(nodeLoggingComponentType);
		try {
			let deploymentPackageId: string | undefined = this._config.deploymentPkgId;

			if (!Is.stringValue(deploymentPackageId)) {
				const contractData = this._deploymentConfig[this._config.network as NetworkTypes];

				if (!Is.objectValue<IContractData>(contractData)) {
					throw new GeneralError(
						IotaVerifiableStorageConnector.CLASS_NAME,
						"contractDataNotFound",
						{
							network: this._config.network,
							availableNetworks: Object.keys(this._deploymentConfig)
						}
					);
				}

				deploymentPackageId = contractData.deployedPackageId;
			}

			if (!Is.stringValue(deploymentPackageId)) {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"deployedPackageIdRequired",
					{
						network: this._config.network
					}
				);
			}

			this._deployedPackageId = deploymentPackageId;

			if (!this._deployedPackageId) {
				throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "packageIdNotFound", {
					network: this._config.network
				});
			}

			const packageExists = await Iota.packageExistsOnNetwork(
				this._client,
				this._deployedPackageId
			);

			if (!packageExists) {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"packageNotFoundOnNetwork",
					{
						network: this._config.network,
						deployedPackageId: this._deployedPackageId
					}
				);
			}

			await nodeLogging?.log({
				level: "info",
				source: IotaVerifiableStorageConnector.CLASS_NAME,
				ts: Date.now(),
				message: "contractReady",
				data: {
					network: this._config.network,
					deployedPackageId: this._deployedPackageId
				}
			});
		} catch (error) {
			await nodeLogging?.log({
				level: "error",
				source: IotaVerifiableStorageConnector.CLASS_NAME,
				ts: Date.now(),
				message: "startFailed",
				error: BaseError.fromError(error),
				data: {
					network: this._config.network
				}
			});

			throw error;
		}
	}

	/**
	 * Create an item in verifiable storage.
	 * @param controllerIdentity The identity of the user to access the vault keys.
	 * @param data The data to store.
	 * @param allowList The list of identities that are allowed to modify the item.
	 * @param options Additional options for creating the item.
	 * @param options.maxAllowListSize The maximum size of the allow list.
	 * @returns The id of the stored verifiable item in URN format and the receipt.
	 */
	public async create(
		controllerIdentity: string,
		data: Uint8Array,
		allowList?: string[],
		options?: {
			maxAllowListSize?: number;
		}
	): Promise<{
		id: string;
		receipt: IJsonLdNodeObject;
	}> {
		this.ensureStarted();
		Guards.stringValue(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(controllerIdentity),
			controllerIdentity
		);
		Guards.uint8Array(IotaVerifiableStorageConnector.CLASS_NAME, nameof(data), data);
		if (!Is.empty(allowList)) {
			Guards.array<string>(IotaVerifiableStorageConnector.CLASS_NAME, nameof(allowList), allowList);
		}
		if (!Is.empty(options?.maxAllowListSize)) {
			Guards.integer(
				IotaVerifiableStorageConnector.CLASS_NAME,
				nameof(options.maxAllowListSize),
				options.maxAllowListSize
			);
		}
		const maxAllowListSize = Math.max(
			options?.maxAllowListSize ?? IotaVerifiableStorageConnector._DEFAULT_ALLOW_LIST_SIZE,
			1
		);

		try {
			const txb = Iota.createTransaction();
			txb.setGasBudget(this._gasBudget);

			const packageId = this._deployedPackageId;
			const moduleName = this.getModuleName();

			txb.moveCall({
				target: `${packageId}::${moduleName}::store_data`,
				arguments: [
					txb.pure.string(Converter.bytesToBase64(data)),
					txb.pure.vector("address", allowList ?? []),
					txb.pure.u16(maxAllowListSize)
				]
			});

			const address = await Iota.getAddress(
				this._vaultConnector,
				this._config,
				controllerIdentity,
				this._config.accountAddressIndex ?? 0,
				this._config.walletAddressIndex ?? 0
			);

			const result = await Iota.prepareAndPostTransaction(
				this._config,
				this._vaultConnector,
				this._logging,
				controllerIdentity,
				this._client,
				address,
				txb,
				{
					dryRunLabel: this._config.enableCostLogging ? "store" : undefined
				}
			);

			if (result.effects?.status?.status !== "success") {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"storingTransactionFailed",
					{
						error: result.effects?.status?.error
					}
				);
			}

			const storageEvent = result.events?.find(event =>
				event.type.includes("verifiable_storage::StorageCreated")
			);

			const parsedJson = storageEvent?.parsedJson as { id: string; epoch: string };

			const objectId = parsedJson?.id;

			if (!Is.stringValue(objectId)) {
				throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "objectIdNotFound", {
					namespace: IotaVerifiableStorageConnector.NAMESPACE
				});
			}

			const receipt: IVerifiableStorageIotaReceipt2026 = {
				"@context": VerifiableStorageContexts.Context,
				type: IotaVerifiableStorageTypes.IotaReceipt2026,
				epoch: Coerce.integer(parsedJson?.epoch) ?? 0,
				digest: result?.digest ?? "",
				network: this._config.network,
				objectId,
				smartContractId: this._deployedPackageId ?? ""
			};

			const urn = new Urn(
				"verifiable",
				`${IotaVerifiableStorageConnector.NAMESPACE}:${this._deployedPackageId}:${objectId}`
			);

			return {
				id: urn.toString(),
				receipt: receipt as unknown as IJsonLdNodeObject
			};
		} catch (error) {
			if (Iota.isAbortError(error, 1001)) {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"allowListTooBig",
					undefined,
					error
				);
			}
			throw new GeneralError(
				IotaVerifiableStorageConnector.CLASS_NAME,
				"creatingFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Update an item in verifiable storage.
	 * @param controllerIdentity The identity of the user to access the vault keys.
	 * @param id The id of the item to update.
	 * @param data The data to store.
	 * @param allowList Updated list of identities that are allowed to modify the item.
	 * @returns The updated receipt.
	 */
	public async update(
		controllerIdentity: string,
		id: string,
		data?: Uint8Array,
		allowList?: string[]
	): Promise<IJsonLdNodeObject> {
		Guards.stringValue(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(controllerIdentity),
			controllerIdentity
		);
		Urn.guard(IotaVerifiableStorageConnector.CLASS_NAME, nameof(id), id);
		if (!Is.empty(data)) {
			Guards.uint8Array(IotaVerifiableStorageConnector.CLASS_NAME, nameof(data), data);
		}
		if (!Is.empty(allowList)) {
			Guards.array<string>(IotaVerifiableStorageConnector.CLASS_NAME, nameof(allowList), allowList);
		}

		const objectId = IotaVerifiableStorageUtils.verifiableStorageIdToObjectId(id);

		try {
			const txb = Iota.createTransaction();
			txb.setGasBudget(this._gasBudget);

			const packageId = this._deployedPackageId;
			const moduleName = this.getModuleName();

			txb.moveCall({
				target: `${packageId}::${moduleName}::update_data`,
				arguments: [
					txb.object(objectId),
					txb.pure.string(Is.empty(data) ? "" : Converter.bytesToBase64(data)),
					txb.pure.vector("address", allowList ?? []),
					txb.pure.bool(Is.array(allowList) && allowList.length === 0)
				]
			});

			const address = await Iota.getAddress(
				this._vaultConnector,
				this._config,
				controllerIdentity,
				this._config.accountAddressIndex ?? 0,
				this._config.walletAddressIndex ?? 0
			);

			const result = await Iota.prepareAndPostTransaction(
				this._config,
				this._vaultConnector,
				this._logging,
				controllerIdentity,
				this._client,
				address,
				txb,
				{
					dryRunLabel: this._config.enableCostLogging ? "update" : undefined
				}
			);

			if (result.effects?.status?.status !== "success") {
				throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "updateFailed", {
					error: result.effects?.status?.error
				});
			}

			const storageEvent = result.events?.find(event =>
				event.type.includes("verifiable_storage::StorageUpdated")
			);

			const parsedJson = storageEvent?.parsedJson as { id: string; epoch: string };

			const receipt: IVerifiableStorageIotaReceipt2026 = {
				"@context": VerifiableStorageContexts.Context,
				type: IotaVerifiableStorageTypes.IotaReceipt2026,
				epoch: Coerce.integer(parsedJson?.epoch) ?? 0,
				digest: result?.digest ?? "",
				network: this._config.network,
				objectId,
				smartContractId: this._deployedPackageId ?? ""
			};

			return receipt as unknown as IJsonLdNodeObject;
		} catch (error) {
			if (Iota.isAbortError(error, 401)) {
				throw new UnauthorizedError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"notInAllowList",
					undefined,
					error
				);
			}
			if (Iota.isAbortError(error, 1001)) {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"allowListTooBig",
					undefined,
					error
				);
			}
			if (BaseError.isErrorName(error, GeneralError.CLASS_NAME)) {
				throw error;
			}

			throw new GeneralError(
				IotaVerifiableStorageConnector.CLASS_NAME,
				"updatingFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Get a verifiable item.
	 * @param id The id of the item to get.
	 * @param options Additional options for getting the item.
	 * @param options.includeData Should the data be included in the response, defaults to true.
	 * @param options.includeAllowList Should the allow list be included in the response, defaults to true.
	 * @returns The data for the item, the receipt and the allow list.
	 */
	public async get(
		id: string,
		options?: { includeData?: boolean; includeAllowList?: boolean }
	): Promise<{
		data?: Uint8Array;
		receipt: IJsonLdNodeObject;
		allowList?: string[];
	}> {
		Guards.stringValue(IotaVerifiableStorageConnector.CLASS_NAME, nameof(id), id);

		const includeData = options?.includeData ?? true;
		const includeAllowList = options?.includeAllowList ?? true;
		const objectId = IotaVerifiableStorageUtils.verifiableStorageIdToObjectId(id);

		try {
			const objectData = await this._client.getObject({
				id: objectId,
				options: {
					showContent: true,
					showPreviousTransaction: true
				}
			});

			if (!objectData.data?.content) {
				throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "objectNotFound");
			}

			const parsedData = objectData.data.content as unknown as {
				fields: {
					data: string;
					epoch: string;
					creator: string;
					allowlist: string[];
				};
			};

			const receipt: IVerifiableStorageIotaReceipt2026 = {
				"@context": VerifiableStorageContexts.Context,
				type: IotaVerifiableStorageTypes.IotaReceipt2026,
				epoch: Coerce.integer(parsedData.fields.epoch) ?? 0,
				digest: objectData.data?.previousTransaction ?? "",
				network: this._config.network,
				objectId,
				smartContractId: this._deployedPackageId ?? ""
			};

			let dataResult: Uint8Array | undefined;

			if (includeData) {
				const base64String = parsedData.fields.data;
				dataResult = Converter.base64ToBytes(base64String);
			}

			return {
				data: dataResult,
				receipt: receipt as unknown as IJsonLdNodeObject,
				allowList: includeAllowList ? parsedData.fields.allowlist : undefined
			};
		} catch (error) {
			if (BaseError.isErrorName(error, GeneralError.CLASS_NAME)) {
				throw error;
			} else {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"gettingFailed",
					undefined,
					Iota.extractPayloadError(error)
				);
			}
		}
	}

	/**
	 * Remove the item from verifiable storage.
	 * @param controllerIdentity The identity of the user to access the vault keys.
	 * @param id The id of the verifiable item to remove in URN format.
	 * @returns A promise that resolves when the item is removed.
	 */
	public async remove(controllerIdentity: string, id: string): Promise<void> {
		Guards.stringValue(
			IotaVerifiableStorageConnector.CLASS_NAME,
			nameof(controllerIdentity),
			controllerIdentity
		);
		Urn.guard(IotaVerifiableStorageConnector.CLASS_NAME, nameof(id), id);

		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== IotaVerifiableStorageConnector.NAMESPACE) {
			throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: IotaVerifiableStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const txb = Iota.createTransaction();
			txb.setGasBudget(this._gasBudget);

			const objectId = IotaVerifiableStorageUtils.verifiableStorageIdToObjectId(id);
			const packageId = IotaVerifiableStorageUtils.verifiableStorageIdToPackageId(id);
			const moduleName = this.getModuleName();

			const address = await Iota.getAddress(
				this._vaultConnector,
				this._config,
				controllerIdentity,
				this._config.accountAddressIndex ?? 0,
				this._config.walletAddressIndex ?? 0
			);

			txb.moveCall({
				target: `${packageId}::${moduleName}::delete_data`,
				arguments: [txb.object(objectId)]
			});

			const result = await Iota.prepareAndPostTransaction(
				this._config,
				this._vaultConnector,
				this._logging,
				controllerIdentity,
				this._client,
				address,
				txb,
				{
					dryRunLabel: this._config.enableCostLogging ? "remove" : undefined
				}
			);

			if (result.effects?.status?.status !== "success") {
				throw new GeneralError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"removingTransactionFailed",
					{
						error: result.effects?.status?.error
					}
				);
			}
		} catch (error) {
			if (Iota.isAbortError(error, 401)) {
				throw new UnauthorizedError(
					IotaVerifiableStorageConnector.CLASS_NAME,
					"notCreator",
					undefined,
					error
				);
			}

			if (BaseError.isErrorName(error, GeneralError.CLASS_NAME)) {
				throw error;
			}

			throw new GeneralError(
				IotaVerifiableStorageConnector.CLASS_NAME,
				"removingFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Ensure that the connector is bootstrapped.
	 * @returns void
	 * @internal
	 */
	private ensureStarted(): void {
		if (!this._deployedPackageId) {
			throw new GeneralError(IotaVerifiableStorageConnector.CLASS_NAME, "connectorNotStarted", {
				packageId: this._deployedPackageId
			});
		}
	}

	/**
	 * Get the module name based on the contract name.
	 * @returns The module name in snake_case.
	 * @internal
	 */
	private getModuleName(): string {
		return StringHelper.snakeCase(this._contractName);
	}
}
