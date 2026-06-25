# Entity Storage Connector Examples

This page provides practical TypeScript examples for using the entity storage connector. These samples demonstrate how to create, retrieve, and manage verifiable items, as well as how to register data types and initialise schemas. The examples are designed to help you integrate verifiable storage into your own applications securely and efficiently.

## EntityStorageVerifiableStorageConnector

```typescript
import { EntityStorageVerifiableStorageConnector } from '@twin.org/verifiable-storage-connector-entity-storage';

const connector = new EntityStorageVerifiableStorageConnector();
// Create a new verifiable item
const controllerIdentity = 'did:example:controller1';
const data = new TextEncoder().encode('Hello, world!');
const allowList = ['did:example:controller1', 'did:example:controller2'];
const options = { maxAllowListSize: 10 };

const { id, receipt } = await connector.create(controllerIdentity, data, allowList, options);
console.log(id); // Outputs the new item id
console.log(receipt); // Outputs the receipt object
```

```typescript
// Retrieve a verifiable item
const item = await connector.get(id, { includeData: true, includeAllowList: true });
if (item.data) {
  const decoded = new TextDecoder().decode(item.data);
  console.log(decoded); // Hello, world!
}
console.log(item.allowList); // Outputs the allow list
console.log(item.receipt); // Outputs the receipt object
```

```typescript
// Update a verifiable item
const updatedData = new TextEncoder().encode('Updated data');
const updatedAllowList = ['did:example:controller1'];
const updatedReceipt = await connector.update(
  controllerIdentity,
  id,
  updatedData,
  updatedAllowList
);
console.log(updatedReceipt); // Outputs the updated receipt object
```

## VerifiableItem

```typescript
import { VerifiableItem } from '@twin.org/verifiable-storage-connector-entity-storage';

const item = new VerifiableItem();
item.id = 'item-123';
item.creator = 'did:example:creator';
item.data = btoa('Sample data');
item.allowList = ['did:example:controller1'];
item.maxAllowListSize = 5;
console.log(item.id); // item-123
console.log(item.creator); // did:example:creator
```

## VerifiableStorageConnectorEntityStorageDataTypes

```typescript
import { VerifiableStorageConnectorEntityStorageDataTypes } from '@twin.org/verifiable-storage-connector-entity-storage';

// Register all data types for the connector
VerifiableStorageConnectorEntityStorageDataTypes.registerTypes();
```

## initSchema

```typescript
import { initSchema } from '@twin.org/verifiable-storage-connector-entity-storage';

// Initialise the schema for verifiable items
initSchema();
```
