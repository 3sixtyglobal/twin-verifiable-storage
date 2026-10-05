# TWIN Verifiable Storage Connector IOTA

This package provides an IOTA based connector for verifiable storage operations, including receipt generation tied to on-chain activity. It is designed for scenarios where verification data needs to be anchored to the IOTA network while keeping a consistent connector interface.

It includes contract and integration support for creation, update, retrieval, and removal flows, along with testing support for sponsored transaction paths.

## Installation

```shell
npm install @twin.org/verifiable-storage-connector-iota
```

## Docker

To perform testing of this component it may be necessary to launch a local instance of the gas station to communicate with.

```shell
docker run -d --name twin-gas-station-test -p 6379:6379 -p 9527:9527 -p 9184:9184 -e IOTA_NODE_URL="https://api.testnet.iota.cafe" -e GAS_STATION_AUTH="qEyCL6d9BKKFl/tfDGAKeGFkhUlf7FkqiGV7Xw4JUsI=" -e GAS_STATION_KEYPAIR="..." twinfoundation/twin-gas-station-test:latest
```

To generate `GAS_STATION_KEYPAIR` see <https://github.com/3sixtyglobal/twin-dlt/blob/main/packages/dlt-iota/README.md>

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)

## Origin

This package is derived from the original [iotaledger/twin-verifiable-storage](https://github.com/iotaledger/twin-verifiable-storage/tree/next/packages/verifiable-storage-connector-iota) repository.
