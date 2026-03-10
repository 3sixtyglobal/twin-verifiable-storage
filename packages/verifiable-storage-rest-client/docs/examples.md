# Verifiable Storage REST Client Examples

This page provides TypeScript examples for using the REST client to interact with verifiable storage endpoints. These samples show how to create, retrieve, and update verifiable storage items over HTTP, making it easier to integrate verifiable storage into your applications.

## VerifiableStorageRestClient

```typescript
import { VerifiableStorageRestClient } from '@twin.org/verifiable-storage-rest-client';

const config = { baseUrl: 'https://api.example.com', apiKey: 'your-api-key' };
const client = new VerifiableStorageRestClient(config);

// Create a new verifiable storage item
const data = new TextEncoder().encode('REST data');
const allowList = ['did:example:controller1'];
const { id, receipt } = await client.create(data, allowList, { maxAllowListSize: 2 });
console.log(id); // Outputs the new item id
console.log(receipt); // Outputs the receipt object
```

```typescript
// Retrieve a verifiable storage item
const item = await client.get(id);
if (item.data) {
  const decoded = new TextDecoder().decode(item.data);
  console.log(decoded); // REST data
}
console.log(item.allowList); // Outputs the allow list
console.log(item.receipt); // Outputs the receipt object
```
