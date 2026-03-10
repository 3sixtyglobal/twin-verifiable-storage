# Verifiable Storage Models Examples

This page provides TypeScript examples for the verifiable storage models, including how to use the main interfaces, types, and the connector factory. These examples are intended to help you understand the structure and usage of the verifiable storage model layer.

## VerifiableStorageConnectorFactory

```typescript
import { VerifiableStorageConnectorFactory } from '@twin.org/verifiable-storage-models';

// List available connector names
const connectorNames = VerifiableStorageConnectorFactory.names();
console.log(connectorNames); // Outputs an array of connector names

// Get a connector instance (example, replace 'entity-storage' with your connector name)
const connector = VerifiableStorageConnectorFactory.get('entity-storage');
console.log(connector.className()); // Outputs the class name of the connector
```

## IVerifiableStorageConnector

```typescript
import type { IVerifiableStorageConnector } from '@twin.org/verifiable-storage-models';

async function createAndGetItem(connector: IVerifiableStorageConnector) {
  const controllerIdentity = 'did:example:controller1';
  const data = new TextEncoder().encode('Sample data');
  const allowList = ['did:example:controller1'];
  const { id, receipt } = await connector.create(controllerIdentity, data, allowList, {
    maxAllowListSize: 5
  });
  console.log(id); // Outputs the new item id
  const item = await connector.get(id);
  if (item.data) {
    const decoded = new TextDecoder().decode(item.data);
    console.log(decoded); // Sample data
  }
}
```

## IVerifiableStorageComponent

```typescript
import type { IVerifiableStorageComponent } from '@twin.org/verifiable-storage-models';

async function createItem(component: IVerifiableStorageComponent) {
  const data = new TextEncoder().encode('Component data');
  const allowList = ['did:example:controller1'];
  const { id, receipt } = await component.create(data, allowList, { maxAllowListSize: 3 });
  console.log(id); // Outputs the new item id
}
```
