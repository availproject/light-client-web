import { Block, Matrix, BlockToProcess } from '@/types/light-client';
import config from "../utils/config"
import { generateRandomCells, getNetworkUrl } from '@/utils/helper';
import { ApiPromise, initialize } from 'avail-js-sdk'
import { bnToU8a } from '@polkadot/util';

export async function runLC(onNewBlock: Function, registerUnsubscribe: Function, network: string): Promise<() => void> {
    const api: ApiPromise = await initialize(getNetworkUrl(network));
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header: any) => {
        try {
            const blockNumber = header.number.toString()
            const blockHash = (await api.rpc.chain.getBlockHash(header.number)).toString();
            const extension = JSON.parse(header.extension)
            const commitment = extension.v3.commitment
            const kateCommitment = commitment.commitment.split('0x')[1]

            // Check if block is with empty commitment
            if (kateCommitment !== '') {
                const r = commitment.rows * config.EXTENSION_FACTOR;
                const c = commitment.cols;

                // Generate commitment array
                const kate_commitment = Uint8Array.from(
                    kateCommitment.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16))
                );
                
                let commitments: Uint8Array[] = [];
                for (let i = 0; i < r; i++) {
                    commitments.push(
                        kate_commitment.slice(i * config.COMMITMENT_SIZE, (i + 1) * config.COMMITMENT_SIZE)
                    );
                }

                const totalCellCount = r * c;
                let sampleCount = config.SAMPLE_SIZE;
                if (sampleCount >= totalCellCount) {
                    sampleCount = 5;
                }

                const randomCells = generateRandomCells(r, c, sampleCount);

                try {
                    //@ts-ignore TODO: need to fix types
                    const kateProof = await api.rpc.kate.queryProof(randomCells, blockHash);
                    
                    let proofs: Uint8Array[] = [];
                    for (let i = 0; i < sampleCount; i++) {
                        const byte32Array = bnToU8a(kateProof[i][0], { isLe: false });
                        const byte80Array = new Uint8Array(80);
                        byte80Array.set(kateProof[i][1], 0);
                        byte80Array.set(byte32Array, 48);
                        proofs.push(byte80Array);
                    }

                    const block: Block = {
                        number: blockNumber,
                        hash: blockHash,
                        totalCellCount,
                        confidence: 0,
                        sampleCount,
                        hasDaSubmissions: true,
                        network: network
                    };

                    const matrix: Matrix = {
                        maxRow: r,
                        maxCol: c,
                        verifiedCells: randomCells,
                        totalCellCount,
                        originalRows: commitment.rows,
                        originalCols: commitment.cols
                    };

                    onNewBlock((list: BlockToProcess[]) => [
                        ...list,
                        {
                            block,
                            matrix,
                            verifiedCells: randomCells,
                            proofs,
                            commitments
                        }
                    ]);
                } catch (error) {
                    console.error('Error processing block:', error);
                }
            } else {
                const block: Block = {
                    number: blockNumber,
                    hash: blockHash,
                    totalCellCount: 0,
                    confidence: 0,
                    sampleCount: 0,
                    hasDaSubmissions: false,
                    network: network
                };
                
                onNewBlock((list: BlockToProcess[]) => [...list, { block, matrix: null, verifiedCells: [], proofs: [], commitments: [] }])
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    return registerUnsubscribe(() => unsubscribe);
}