// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";
import {
	generateRestRoutesVerifiableStorage,
	tagsVerifiableStorage
} from "./verifiableStorageRoutes.js";

/**
 * The REST entry points for the verifiable storage service.
 */
export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "verifiable",
		defaultBaseRoute: "verifiable",
		tags: tagsVerifiableStorage,
		generateRoutes: generateRestRoutesVerifiableStorage
	}
];
