# Verifiable Storage Service Examples

This page provides TypeScript examples for using the verifiable storage service. These samples demonstrate how to create and retrieve verifiable storage items using the service class, making it easier to manage verifiable data in your application.

## VerifiableStorageService

```typescript
import { VerifiableStorageService } from '@3sixty/verifiable-storage-service';

const service = new VerifiableStorageService();

// Create a new verifiable storage item
const data = new TextEncoder().encode('Service data');
const allowList = ['did:example:controller1'];
const { id, receipt } = await service.create(data, allowList, { maxAllowListSize: 2 });
console.log(id); // Outputs the new item id
console.log(receipt); // Outputs the receipt object
```

```typescript
// Retrieve a verifiable storage item
const item = await service.get(id);
if (item.data) {
  const decoded = new TextDecoder().decode(item.data);
  console.log(decoded); // Service data
}
console.log(item.allowList); // Outputs the allow list
console.log(item.receipt); // Outputs the receipt object
```
