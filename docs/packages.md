# Verifiable Storage Packages

## verifiable-storage-models

This package defines shared interfaces, payload models, and context values used across verifiable storage components. It establishes a consistent contract layer so connectors, services, and clients can interoperate without custom model translation in each integration.

- [README](../packages/verifiable-storage-models/README.md)
- [Examples](../packages/verifiable-storage-models/docs/examples.md)
- [Changelog](../packages/verifiable-storage-models/docs/changelog.md)

## verifiable-storage-connector-entity-storage

This package provides a connector implementation that stores verifiable items in an entity storage back end. It supports lifecycle operations with allow list controls, enabling reliable persistence and controlled updates in environments that prefer entity storage infrastructure.

- [README](../packages/verifiable-storage-connector-entity-storage/README.md)
- [Examples](../packages/verifiable-storage-connector-entity-storage/docs/examples.md)
- [Changelog](../packages/verifiable-storage-connector-entity-storage/docs/changelog.md)

## verifiable-storage-connector-iota

This package provides a connector implementation for anchoring verifiable storage activity on the IOTA network. It is focused on creating verifiable receipts from network-backed operations and includes support for broader integration and testing scenarios. See [IOTA](https://www.iota.org/) for ecosystem context.

- [README](../packages/verifiable-storage-connector-iota/README.md)
- [Examples](../packages/verifiable-storage-connector-iota/docs/examples.md)
- [Changelog](../packages/verifiable-storage-connector-iota/docs/changelog.md)

## verifiable-storage-service

This package delivers the service layer and REST route definitions used to expose verifiable storage operations over HTTP. It helps teams deploy storage capabilities behind stable API contracts while keeping behaviour aligned with the shared model layer.

- [README](../packages/verifiable-storage-service/README.md)
- [Examples](../packages/verifiable-storage-service/docs/examples.md)
- [Changelog](../packages/verifiable-storage-service/docs/changelog.md)

## verifiable-storage-rest-client

This package delivers a REST client for consuming verifiable storage endpoints from external applications and services. It streamlines integration by using shared request and response contracts, reducing friction when connecting to deployed verifiable storage APIs.

- [README](../packages/verifiable-storage-rest-client/README.md)
- [Examples](../packages/verifiable-storage-rest-client/docs/examples.md)
- [Changelog](../packages/verifiable-storage-rest-client/docs/changelog.md)
