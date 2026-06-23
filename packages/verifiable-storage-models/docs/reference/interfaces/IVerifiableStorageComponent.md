# Interface: IVerifiableStorageComponent

Interface describing a Verifiable Storage component.

## Extends

- `IComponent`

## Methods

### create() {#create}

> **create**(`data`, `allowList?`, `options?`, `namespace?`, `controller?`): `Promise`\<\{ `id`: `string`; `receipt`: `IJsonLdNodeObject`; \}\>

Create an item in verifiable storage.

#### Parameters

##### data

`Uint8Array`

The data to store.

##### allowList?

`string`[]

The list of identities that are allowed to modify the item.

##### options?

Additional options for creating the item.

###### maxAllowListSize?

`number`

The maximum size of the allow list.

##### namespace?

`string`

The namespace to store the item in.

##### controller?

`string`

The identity of the controller to access the vault keys.

#### Returns

`Promise`\<\{ `id`: `string`; `receipt`: `IJsonLdNodeObject`; \}\>

The id of the stored verifiable item in urn format and the receipt.

***

### update() {#update}

> **update**(`id`, `data?`, `allowList?`, `controller?`): `Promise`\<`IJsonLdNodeObject`\>

Update an item in verifiable storage.

#### Parameters

##### id

`string`

The id of the item to update.

##### data?

`Uint8Array`\<`ArrayBufferLike`\>

The data to store, optional if updating the allow list.

##### allowList?

`string`[]

Updated list of identities that are allowed to modify the item.

##### controller?

`string`

The identity of the controller to access the vault keys.

#### Returns

`Promise`\<`IJsonLdNodeObject`\>

The updated receipt.

***

### get() {#get}

> **get**(`id`, `options?`): `Promise`\<\{ `data?`: `Uint8Array`\<`ArrayBufferLike`\>; `receipt`: `IJsonLdNodeObject`; `allowList?`: `string`[]; \}\>

Get a verifiable item.

#### Parameters

##### id

`string`

The id of the item to get.

##### options?

Additional options for getting the item.

###### includeData?

`boolean`

Should the data be included in the response, defaults to true.

###### includeAllowList?

`boolean`

Should the allow list be included in the response, defaults to true.

#### Returns

`Promise`\<\{ `data?`: `Uint8Array`\<`ArrayBufferLike`\>; `receipt`: `IJsonLdNodeObject`; `allowList?`: `string`[]; \}\>

The data for the item and the receipt.

***

### remove() {#remove}

> **remove**(`id`, `controller?`): `Promise`\<`void`\>

Remove the item from verifiable storage.

#### Parameters

##### id

`string`

The id of the verifiable item to remove in urn format.

##### controller?

`string`

The identity of the controller.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the item has been removed.
