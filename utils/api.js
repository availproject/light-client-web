//import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api'

//use avail-js here
export async function createApi() {
    const provider = new WsProvider("wss://goldberg.avail.tools/ws");
    return ApiPromise.create({
        provider,
        // Pass the below flag to true 👇 to see initial warning about api / rpc decorations
        noInitWarn: true,
        rpc: {
            kate: {
                blockLength: {
                  description: "Get Block Length",
                  params: [
                    {
                      name: "at",
                      type: "Hash",
                      isOptional: true,
                    },
                  ],
                  type: "BlockLength",
                },
                queryProof: {
                  description: "Generate the kate proof for the given `cells`",
                  params: [
                    {
                      name: "cells",
                      type: "Vec<Cell>",
                    },
                    {
                      name: "at",
                      type: "Hash",
                      isOptional: true,
                    },
                  ],
                  type: "Vec<u8>",
                },
                queryDataProof: {
                  description: "Generate the data proof for the given `transaction_index`",
                  params: [
                    {
                      name: "transaction_index",
                      type: "u32",
                    },
                    {
                      name: "at",
                      type: "Hash",
                      isOptional: true,
                    },
                  ],
                  type: "DataProof",
                },
                queryDataProofV2: {
                  description: "Generate the data proof for the given `transaction_index`",
                  params: [
                    {
                      name: "transaction_index",
                      type: "u32",
                    },
                    {
                      name: "at",
                      type: "Hash",
                      isOptional: true,
                    },
                  ],
                  type: "ProofResponse",
                },
                queryAppData: {
                  description: "Fetches app data rows for the given app",
                  params: [
                    {
                      name: "app_id",
                      type: "AppId",
                    },
                    {
                      name: "at",
                      type: "Hash",
                      isOptional: true,
                    },
                  ],
                  type: "Vec<Option<Vec<u8>>>",
                },
                queryRows: {
                  description: "Query rows based on their indices",
                  params: [
                    {
                      name: "rows",
                      type: "Vec<u32>",
                    },
                    {
                      name: "at",
                      type: "Hash",
                      isOptional: true,
                    },
                  ],
                  type: "Vec<Vec<u8>>",
                },
              },
        },
        types: {
            AppId: 'Compact<u32>',
            DataLookupIndexItem: {
                appId: 'AppId',
                start: 'Compact<u32>'
            },
            DataLookup: {
                size: 'Compact<u32>',
                index: 'Vec<DataLookupIndexItem>'
            },
            KateCommitment: {
                rows: 'Compact<u16>',
                cols: 'Compact<u16>',
                dataRoot: 'H256',
                commitment: 'Vec<u8>'
            },
            V1HeaderExtension: {
                commitment: 'KateCommitment',
                appLookup: 'DataLookup'
            },
            V2HeaderExtension: {
                appLookup: "DataLookup",
                commitment: "KateCommitment",
              },
              V3HeaderExtension: {
                appLookup: "DataLookup",
                commitment: "KateCommitment",
              },
            HeaderExtension: {
                _enum: {
                    V1: 'V1HeaderExtension',
                    V2: 'V2HeaderExtension',
                    V3: "V3HeaderExtension",
                }
            },
            DaHeader: {
                parentHash: 'Hash',
                number: 'Compact<BlockNumber>',
                stateRoot: 'Hash',
                extrinsicsRoot: 'Hash',
                digest: 'Digest',
                extension: 'HeaderExtension'
            },
            Header: 'DaHeader',
            CheckAppIdExtra: {
                appId: 'AppId'
            },
            CheckAppIdTypes: {},
            CheckAppId: {
                extra: 'CheckAppIdExtra',
                types: 'CheckAppIdTypes'
            },
            BlockLength: {
                max: 'PerDispatchClass',
                cols: 'Compact<u32>',
                rows: 'Compact<u32>',
                chunkSize: 'Compact<u32>'
            },
            PerDispatchClass: {
                normal: 'u32',
                operational: 'u32',
                mandatory: 'u32'
            },
            DataProof: {
                root: 'H256',
                proof: 'Vec<H256>',
                numberOfLeaves: 'Compact<u32>',
                leaf_index: 'Compact<u32>',
                leaf: 'H256'
            },
            Cell: {
                row: 'u32',
                col: 'u32',
            }
        },
        signedExtensions: {
            CheckAppId: {
                extrinsic: {
                    appId: 'AppId'
                },
                payload: {}
            },
        }
    });
}