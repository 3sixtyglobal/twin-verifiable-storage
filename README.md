# TWIN Verifiable Storage

This repository provides a modular set of components for creating, exposing, and consuming verifiable storage capabilities across different environments. The packages work together to model shared contracts, connect to storage back ends, and expose consistent service interfaces for application integration.

The overall goal is to make verifiable data operations dependable and interoperable, whether you are building directly against connector implementations or integrating through REST APIs. Each package focuses on a clear responsibility so teams can adopt only the parts they need while keeping behaviour aligned across the stack.

## Packages

- [verifiable-storage-models](packages/verifiable-storage-models/README.md) - Shared interfaces, API payload models, and connector factory contracts for verifiable storage
- [verifiable-storage-connector-entity-storage](packages/verifiable-storage-connector-entity-storage/README.md) - Entity storage connector that persists verifiable items with allow list controls
- [verifiable-storage-connector-iota](packages/verifiable-storage-connector-iota/README.md) - IOTA connector that anchors verifiable storage operations on-chain and returns receipts
- [verifiable-storage-service](packages/verifiable-storage-service/README.md) - Service component and REST routes that expose verifiable storage operations
- [verifiable-storage-rest-client](packages/verifiable-storage-rest-client/README.md) - REST client component for calling verifiable storage service endpoints

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)
