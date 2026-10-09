// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@3sixty/core";
import type { IVerifiableStorageConnector } from "../models/IVerifiableStorageConnector.js";

/**
 * Factory for creating verifiable storage connectors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const VerifiableStorageConnectorFactory = Factory.createFactory<IVerifiableStorageConnector>(
	"verifiable-storage-connector"
);
